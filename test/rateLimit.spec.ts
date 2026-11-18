import { env, fetchMock, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import worker from '../src/index';

const discord = () => fetchMock.get('https://discord.com');
const invitePath = (code: string) => `/api/v10/invites/${code}?with_counts=true`;

const fakeInvite = (code: string) => ({
	code,
	approximate_member_count: 1234,
	approximate_presence_count: 56,
	guild: { id: '81384788765712384', name: `Guild ${code}`, icon: null, features: [] },
});

async function get(path: string): Promise<Response> {
	const ctx = createExecutionContext();
	const res = await worker.fetch(new Request(`https://invidget.switchblade.xyz${path}`), env, ctx);
	await waitOnExecutionContext(ctx); // let cache.put() finish
	return res;
}

// The 429 cooldown lives in module state and survives between tests. Move the clock
// forward an hour before each test so a previous test's cooldown has always expired.
let clock = Date.UTC(2030, 0, 1);

beforeAll(() => {
	fetchMock.activate();
	// Any request without a matching interceptor fails, so the Worker answers 500.
	// A test that gets a 503 back therefore made no unexpected Discord call.
	fetchMock.disableNetConnect();
});

beforeEach(() => {
	clock += 60 * 60 * 1000;
	vi.useFakeTimers({ toFake: ['Date'] });
	vi.setSystemTime(clock);
});

afterEach(() => {
	vi.useRealTimers();
	fetchMock.assertNoPendingInterceptors();
});

describe('Discord rate limits', () => {
	it('returns 503 with Retry-After and a matching short cache when Discord answers 429', async () => {
		discord().intercept({ path: invitePath('ratelimited') }).reply(429, '{}', { headers: { 'retry-after': '5' } });

		const res = await get('/ratelimited');

		expect(res.status).toBe(503);
		expect(res.headers.get('Retry-After')).toBe('5');
		expect(res.headers.get('Cache-Control')).toBe('public, max-age=5, s-maxage=5');
	});

	it('rounds a fractional Retry-After up to whole seconds', async () => {
		discord().intercept({ path: invitePath('fractional') }).reply(429, '{}', { headers: { 'retry-after': '1.5' } });

		const res = await get('/fractional');

		expect(res.status).toBe(503);
		expect(res.headers.get('Retry-After')).toBe('2');
	});

	it('falls back to 30s when Discord sends no Retry-After', async () => {
		discord().intercept({ path: invitePath('noretry') }).reply(429, '{}');

		const res = await get('/noretry');

		expect(res.status).toBe(503);
		expect(res.headers.get('Retry-After')).toBe('30');
		expect(res.headers.get('Cache-Control')).toBe('public, max-age=30, s-maxage=30');
	});

	it('caps the error cache at 5 minutes when Retry-After is long', async () => {
		discord().intercept({ path: invitePath('longban') }).reply(429, '{}', { headers: { 'retry-after': '3600' } });

		const res = await get('/longban');

		expect(res.headers.get('Retry-After')).toBe('3600');
		expect(res.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=300');
	});

	it('skips Discord for other invites during the cooldown, then resumes after it', async () => {
		discord().intercept({ path: invitePath('first') }).reply(429, '{}', { headers: { 'retry-after': '10' } });
		expect((await get('/first')).status).toBe(503);

		// No interceptor for "second": a Discord call would fail with 500, so 503 proves it was skipped.
		vi.setSystemTime(clock + 5_000);
		const during = await get('/second');
		expect(during.status).toBe(503);
		expect(Number(during.headers.get('Retry-After'))).toBeLessThanOrEqual(5);

		// After the cooldown the Worker calls Discord again.
		vi.setSystemTime(clock + 11_000);
		discord().intercept({ path: invitePath('third') }).reply(200, fakeInvite('third'));
		const after = await get('/third');
		expect(after.status).toBe(200);
		expect(after.headers.get('Content-Type')).toBe('image/svg+xml');
	});

	it('serves a repeated request for a rate-limited invite from the edge cache', async () => {
		discord().intercept({ path: invitePath('cachedfail') }).reply(429, '{}', { headers: { 'retry-after': '10' } });
		expect((await get('/cachedfail')).status).toBe(503);

		// 2s later the cooldown would produce a fresh 503 with Retry-After 8. Getting the
		// original "10" back means the response came from the edge cache instead.
		vi.setSystemTime(clock + 2_000);
		const again = await get('/cachedfail');
		expect(again.status).toBe(503);
		expect(again.headers.get('Retry-After')).toBe('10');
		expect(again.headers.has('X-Invidget-Status')).toBe(false);
	});
});

describe('other Discord errors', () => {
	it('returns 502 with a short cache on a Discord 5xx', async () => {
		discord().intercept({ path: invitePath('outage') }).reply(500, 'oops');

		const res = await get('/outage');

		expect(res.status).toBe(502);
		expect(res.headers.get('Cache-Control')).toBe('public, max-age=30, s-maxage=30');
	});

	it('returns 404 for an unknown invite', async () => {
		discord().intercept({ path: invitePath('gone') }).reply(404, '{}');

		const res = await get('/gone');

		expect(res.status).toBe(404);
	});
});

describe('successful render', () => {
	it('renders the widget with the long cache and serves repeats from cache', async () => {
		discord().intercept({ path: invitePath('works') }).reply(200, fakeInvite('works'));

		const res = await get('/works');
		expect(res.status).toBe(200);
		expect(res.headers.get('Cache-Control')).toBe('public, max-age=43200, s-maxage=86400');
		// Text is rendered as vector paths, so check the join link instead of the guild name.
		expect(await res.text()).toContain('https://discord.gg/works');

		// Only one interceptor was registered: the second request must come from the cache.
		const again = await get('/works?utm=whatever');
		expect(again.status).toBe(200);
		expect(await again.text()).toContain('https://discord.gg/works');
	});
});

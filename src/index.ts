import React from 'react';
import { InviteTemplateQuery } from './components/InviteTemplate';
import LegacyTemplate from './components/LegacyTemplate/LegacyTemplate';
import { renderToString } from 'react-dom/server';
import ISO6391, { LanguageCode } from 'iso-639-1';
import { ThemeVariation, themeVariations } from './types/themes';
import InviteResolver, { InvalidInviteError } from './InviteResolver';
import DiscordApi, { DiscordApiError, InvidgetInvite } from './DiscordApi';

/**
 * How long browsers / camo (max-age, 12h) and the Cloudflare edge (s-maxage, 24h) keep a rendered widget.
 * Worst-case staleness is the sum of both (~36h); member counts that old are acceptable.
 */
const SVG_CACHE_CONTROL = 'public, max-age=43200, s-maxage=86400';
/** Invalid / unknown invites. */
const NOT_FOUND_CACHE_CONTROL = 'public, max-age=300, s-maxage=300';
/** Transient errors (rate limits, Discord outages): keep briefly so a burst doesn't hammer Discord. */
const ERROR_TTL_SECONDS = 30;

/**
 * Per-isolate cooldown after Discord returns 429. Workers share egress IPs, so once
 * we are limited, further calls from this isolate only make it worse.
 */
let rateLimitedUntil = 0;

export default {
	async fetch(request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			return textResponse('Method Not Allowed', 405, 'no-store', { Allow: 'GET, HEAD' });
		}

		const url = new URL(request.url);
		let path: string;
		try {
			path = decodeURIComponent(url.pathname.slice(1));
		} catch {
			return textResponse('Not Found: Invalid invite code.', 404, NOT_FOUND_CACHE_CONTROL);
		}
		const query = parseQuery(url.searchParams);

		// Normalize the cache key so unknown/cache-busting params and param order share one entry.
		const cacheKey = new Request(buildCacheKeyUrl(url, path, query), { method: 'GET' });
		// @types/node's `caches` global shadows the Workers type, which has `.default`.
		const cache = (caches as unknown as { default: Cache }).default;

		const cached = await cache.match(cacheKey);
		if (cached) return cached;

		const response = await handle(path, query);

		if (response.headers.get('Cache-Control')?.startsWith('public')) {
			ctx.waitUntil(cache.put(cacheKey, response.clone()).catch((err) => console.error('cache.put failed:', err)));
		}

		return response;
	},
} satisfies ExportedHandler<Env>;

async function handle(path: string, query: InviteTemplateQuery): Promise<Response> {
	if (path === '') {
		return textResponse('Usage: https://invidget.switchblade.xyz/<invite code or guild id>', 404, NOT_FOUND_CACHE_CONTROL);
	}

	let inviteCode: string;
	try {
		inviteCode = await InviteResolver.resolve(path);
	} catch (err) {
		return errorResponse(err);
	}

	try {
		if (Date.now() < rateLimitedUntil) {
			const remaining = Math.ceil((rateLimitedUntil - Date.now()) / 1000);
			throw new DiscordApiError('Skipping Discord call: rate-limit cooldown active', 429, String(remaining));
		}

		const invite = await DiscordApi.getInvite(inviteCode, query.animation);
		return svgResponse(invite, query, SVG_CACHE_CONTROL);
	} catch (err) {
		if (err instanceof DiscordApiError && err.isRateLimit) {
			const seconds = Number(err.retryAfter) || ERROR_TTL_SECONDS;
			rateLimitedUntil = Math.max(rateLimitedUntil, Date.now() + seconds * 1000);
		}
		return errorResponse(err);
	}
}

function svgResponse(invite: InvidgetInvite, query: InviteTemplateQuery, cacheControl: string): Response {
	const svgString = renderToString(React.createElement(LegacyTemplate, { invite, ...query }));
	return new Response(svgString, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': cacheControl,
		},
	});
}

function errorResponse(err: unknown): Response {
	if (err instanceof InvalidInviteError) {
		return textResponse(`Not Found: ${err.message}`, 404, NOT_FOUND_CACHE_CONTROL);
	}

	if (err instanceof DiscordApiError) {
		if (err.isNotFound) return textResponse('Not Found: Unknown invite or guild.', 404, NOT_FOUND_CACHE_CONTROL);

		if (err.isRateLimit) {
			console.warn(err.message);
			const retryAfter = Math.max(1, Math.ceil(Number(err.retryAfter) || ERROR_TTL_SECONDS));
			const ttl = Math.min(retryAfter, 300);
			return textResponse('Service Unavailable: Discord is rate limiting requests, try again later.', 503, `public, max-age=${ttl}, s-maxage=${ttl}`, {
				'Retry-After': String(retryAfter),
			});
		}

		console.error(err.message);
		return textResponse(`Bad Gateway: Discord returned ${err.status}.`, 502, `public, max-age=${ERROR_TTL_SECONDS}, s-maxage=${ERROR_TTL_SECONDS}`);
	}

	console.error('Unexpected error:', err);
	return textResponse('Internal Server Error', 500, 'no-store');
}

function textResponse(body: string, status: number, cacheControl: string, headers: Record<string, string> = {}): Response {
	return new Response(body, {
		status,
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': cacheControl, ...headers },
	});
}

function buildCacheKeyUrl(url: URL, path: string, query: InviteTemplateQuery): string {
	const key = new URL(`/${encodeURIComponent(path)}`, url.origin);
	if (query.language) key.searchParams.set('language', query.language);
	if (query.theme) key.searchParams.set('theme', query.theme);
	if (!query.animation) key.searchParams.set('animation', 'false');
	return key.toString();
}

function parseQuery(params: URLSearchParams): InviteTemplateQuery {
	const language = params.get('language');
	const theme = params.get('theme');

	return {
		language: ISO6391.validate(language ?? '') ? (language as LanguageCode) : undefined,
		animation: params.get('animation') !== 'false', // true by default
		theme: (themeVariations as readonly string[]).includes(theme ?? '') ? (theme as ThemeVariation) : undefined,
	};
}

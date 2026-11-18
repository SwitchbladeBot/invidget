import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		// discord-api-types' .mjs re-exports a CJS file the Workers test runtime can't resolve.
		deps: { optimizer: { ssr: { enabled: true, include: ['discord-api-types/v10'] } } },
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.jsonc' },
			},
		},
	},
});

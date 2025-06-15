import React from 'react';
import { InviteTemplate, InviteTemplateQuery } from './components/InviteTemplate';
import LegacyTemplate from './components/LegacyTemplate/LegacyTemplate';
import { renderToString } from 'react-dom/server';
import ISO6391, { LanguageCode } from 'iso-639-1';
import { ThemeVariation, themeVariations } from './types/themes';
import InviteResolver from './InviteResolver';
import DiscordApi from './DiscordApi';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		let inviteCode: string;

		if (url.pathname.slice(1) === 'favicon.ico') return new Response(`Favicon`, {
				status: 404,
				headers: { 'Content-Type': 'text/plain' },
			});

		try {
			inviteCode = await InviteResolver.resolve(url.pathname.slice(1));
		} catch (error) {
			console.error('InviteResolver error:', error);

			return new Response(`Not Found: ${(error as Error).message}`, {
				status: 404,
				headers: { 'Content-Type': 'text/plain' },
			});
		}

		/*const reactElement = React.createElement(InviteTemplate, {
			inviteCode,
			...parseQuery(url.searchParams),
		});*/

		const query = parseQuery(url.searchParams)

		const reactElement = React.createElement(LegacyTemplate, {
			invite: await DiscordApi.getInvite(inviteCode, query.animation),
			...query,
		});

		const svgString = renderToString(reactElement);

		return new Response(svgString, {
			headers: {
				'Content-Type': 'image/svg+xml',
			},
		});
	},
} satisfies ExportedHandler<Env>;

function parseQuery(params: URLSearchParams): InviteTemplateQuery {
	const language = params.get('language');
	const theme = params.get('theme');

	return {
		language: ISO6391.validate(language ?? '') ? (language as LanguageCode) : undefined,
		animation: params.get('animation') !== 'false', // true by default
		theme: (themeVariations as readonly string[]).includes(theme ?? '') ? (theme as ThemeVariation) : undefined,
	};
}

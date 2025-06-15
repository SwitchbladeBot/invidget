import { LanguageCode } from 'iso-639-1';
import { JSX } from 'react';
import { ThemeVariation } from '../types/themes';

export type InviteTemplateProps = { inviteCode: string } &
	InviteTemplateQuery;

export type InviteTemplateQuery = {
	language?: LanguageCode;
	animation?: boolean;
	theme?: ThemeVariation;
};

export const InviteTemplate = ({
	inviteCode,
	language = 'en',
	animation = true,
	theme = 'dark',
}: InviteTemplateProps): JSX.Element => (
	<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
		<rect width="200" height="200" fill="blue" />
		<text
			x="100"
			y="100"
			fill="white"
			fontSize="16"
			fontFamily="Arial, sans-serif"
			dominantBaseline="middle"
			textAnchor="middle"
			style={{ userSelect: 'none' }}
		>
			{`${inviteCode ? inviteCode : 'nothing'} - theme: ${theme}`}
		</text>
	</svg>
);

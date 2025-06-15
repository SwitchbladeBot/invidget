import { LegacyThemeColors } from '../../types/themes';

export const PADDING = 16;
export const ICON_SIZE = 50;

export const HEADER_FONT_SIZE = 12;
export const HEADER_LINE_HEIGHT = 16;
export const HEADER_MARGIN_BOTTOM = 12;

export const SERVER_NAME_SIZE = 16;
export const SERVER_NAME_LINE_HEIGHT = 20;
export const SERVER_NAME_MARGIN_BOTTOM = 2;

export const PRESENCE_FONT_SIZE = 14;
export const PRESENCE_LINE_HEIGHT = 16;
export const PRESENCE_TEXT_MARGIN_RIGHT = 8;

export const PRESENCE_DOT_SIZE = 8;
export const PRESENCE_DOT_MARGIN_RIGHT = 4;

export const INVITE_WIDTH = 430;
export const INVITE_HEIGHT = 110;

export const BUTTON_WIDTH = 94.75;
export const BUTTON_HEIGHT = 40;
export const BUTTON_MARGIN_LEFT = 10;

export const BADGE_MARGIN_RIGHT = 8;

export const COMMON_COLORS: LegacyThemeColors = {
	background: '#2f3136',
	serverName: '#ffffff',
	header: '#b9bbbe',
	serverIcon: '#36393f',
	acronymText: '#dcddde',
	presenceText: '#b9bbbe',
	joinButtonBackground: '#3ba55c',
	joinButtonText: '#ffffff',
	online: '#3ba55c',
	members: '#747f8d',
	badges: {
		PARTNERED: {
			flowerStar: '#7289da',
			icon: '#ffffff',
		},
		VERIFIED: {
			flowerStar: '#3ba55c',
			icon: '#ffffff',
		},
	},
};

export const THEMES: Record<string, LegacyThemeColors> = {
	dark: COMMON_COLORS,
	light: {
		...COMMON_COLORS,
		background: '#f2f3f5',
		serverName: '#060607',
		header: '#4f5660',
		serverIcon: '#ffffff',
		acronymText: '#2e3338',
		presenceText: '#4f5660',
	},
};

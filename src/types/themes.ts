export const themeVariations = ['light', 'dark'] as const;

export type ThemeVariation = typeof themeVariations[number];

export type Theme = {
  background: string;
  serverName: string;
  header: string;
  serverIcon: string;
  acronymText: string;
  presenceText: string;
};

export type Themes = {
  [key in ThemeVariation]: Theme;
};

export type LegacyThemeColors = {
  background: string,
  header: string,
  serverIcon: string,
  acronymText: string,
  joinButtonBackground: string,
  joinButtonText: string,
  serverName: string,
  online: string,
  members: string,
  presenceText: string,
  badges: {
    VERIFIED: { flowerStar: string, icon: string },
    PARTNERED: { flowerStar: string, icon: string },
  },
};
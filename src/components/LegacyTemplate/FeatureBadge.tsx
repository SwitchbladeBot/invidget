import { ReactElement } from 'react';
import { SERVER_NAME_SIZE } from './const';
import { LegacyThemeColors } from '../../types/themes';
import { PARTNER_ICON, SPECIAL_BADGE, VERIFIED_ICON } from '../../const/icons';
export interface BadgeProps {
  hasVerified: boolean;
  hasHub: boolean;
  hasPartnered: boolean;
  themeColors: LegacyThemeColors;
}

export const FeatureBadge: React.FC<BadgeProps> = ({ hasVerified, hasHub, hasPartnered, themeColors }) => {
	if (hasVerified) {
		return (
			<g transform={`translate(0, 3)`}>
				<path cx={8} cy={8} r={8} d={SPECIAL_BADGE} fill={themeColors.badges.VERIFIED.flowerStar} />				
				<path cx={8} cy={8} r={8} d={VERIFIED_ICON} fill={themeColors.badges.VERIFIED.icon}/>
			</g>
		);
	} else if (hasPartnered) {
		return (
			<g transform={`translate(0, 3)`}>
				<path cx={8} cy={8} r={8} d={SPECIAL_BADGE} fill={themeColors.badges.PARTNERED.flowerStar}/>				
				<path cx={8} cy={8} r={8} d={PARTNER_ICON} fill={themeColors.badges.PARTNERED.icon}/>
			</g>
		);
	}
	return null;
}

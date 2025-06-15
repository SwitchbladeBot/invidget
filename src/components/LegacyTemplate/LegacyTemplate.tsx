import { LanguageCode } from 'iso-639-1';
import { GuildFeature } from 'discord-api-types/v10';
import {
	INVITE_WIDTH,
	INVITE_HEIGHT,
	PADDING,
	HEADER_FONT_SIZE,
	HEADER_LINE_HEIGHT,
	ICON_SIZE,
	PRESENCE_FONT_SIZE,
	SERVER_NAME_SIZE,
	SERVER_NAME_LINE_HEIGHT,
	SERVER_NAME_MARGIN_BOTTOM,
	PRESENCE_DOT_SIZE,
	PRESENCE_LINE_HEIGHT,
	PRESENCE_DOT_MARGIN_RIGHT,
	PRESENCE_TEXT_MARGIN_RIGHT,
	COMMON_COLORS,
	THEMES,
	HEADER_MARGIN_BOTTOM,
} from './const';
import { ThemeVariation } from '../../types/themes';
import { getLocaleStrings } from '../../types/language';
import { FeatureBadge } from './FeatureBadge';
import JoinButton from './JoinButton';
import { TextToSvgRenderer } from './Font/TextToSvgRenderer';
import WhitneyBoldRegular from '../../fonts/WhitneyBoldRegular';
import WhitneySemibold from '../../fonts/WhitneySemibold';
import { InvidgetInvite } from '../../DiscordApi';

interface InviteRendererProps {
	invite: InvidgetInvite;
	language?: LanguageCode;
	animation?: boolean;
	theme?: ThemeVariation;
}

export default function LegacyTemplate({ invite, language = 'en', animation = true, theme = 'dark' }: InviteRendererProps) {
	const locale = getLocaleStrings(language);
	const themeColors = THEMES[theme] || THEMES.dark;

	if (!invite.guild) throw new Error('Invalid invite, Guild is missing');

	const hasVerified = invite.guild.features.includes(GuildFeature.Verified);
	const hasHub = invite.guild.features.includes(GuildFeature.Hub);
	const hasPartnered = invite.guild.features.includes(GuildFeature.Partnered);

	const formatNumber = (num: number) => num.toLocaleString();

	const allMembersMargin =
		PRESENCE_DOT_SIZE +
		PRESENCE_DOT_MARGIN_RIGHT +
		locale.online.replace('{{count}}', formatNumber(invite.approximate_presence_count ? invite.approximate_presence_count : 0)).length *
			6.29 + // approximate width
		PRESENCE_TEXT_MARGIN_RIGHT +
		PRESENCE_DOT_SIZE / 2;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			width={INVITE_WIDTH}
			height={INVITE_HEIGHT}
			viewBox={`0 0 ${INVITE_WIDTH} ${INVITE_HEIGHT}`}
			role="img"
			aria-label="Discord Invite Card"
		>
			<rect width={INVITE_WIDTH} height={INVITE_HEIGHT} rx="3" ry="3" fill={themeColors.background} />
			
			
			<TextToSvgRenderer
					text={(hasHub ? locale.header_hub : locale.header).toUpperCase()}
					options={{
						anchor: 'start',
						baseline: 'bottom',
						fontSize: HEADER_FONT_SIZE,
						fill: themeColors.header,
						y: PADDING + HEADER_LINE_HEIGHT * .75,
						x: PADDING
					}}
					font={WhitneyBoldRegular}
				/>
			<svg width={INVITE_WIDTH - 2 * PADDING} height={INVITE_HEIGHT - 2 * PADDING} x={PADDING} y={PADDING}>

				{/* Content container */}
				<g transform={`translate(0, ${HEADER_LINE_HEIGHT + HEADER_MARGIN_BOTTOM})`}>
					{/* Server Icon */}

					{invite.guild.icon ? (
						<image
							width={ICON_SIZE}
							height={ICON_SIZE}
							rx={16}
							ry={16}
							href={`data:image/${invite.guild.icon.startsWith('a_') ? 'gif' : 'jpg'};base64,${invite.iconBase64}`}
							clipPath='url(#iconClip)'
						/>
					) : (
						<rect width={ICON_SIZE} height={ICON_SIZE} rx={16} ry={16} fill={themeColors.serverIcon} />
					)}

					<defs>
						<clipPath id="iconClip">
							<rect width={ICON_SIZE} height={ICON_SIZE} rx={16} ry={16} />
						</clipPath>
					</defs>

					{/* Join Button */}

					<a href={`https://discord.gg/${invite.code}`} target="_blank">
						<JoinButton themeColors={themeColors} text={locale.button} />
					</a>

					{/* Server Name + Badges */}
					<g transform={`translate(${ICON_SIZE + PADDING}, ${PADDING * 0.35})`}>
						<g>
							<FeatureBadge hasVerified={hasVerified} hasHub={hasHub} hasPartnered={hasPartnered} themeColors={themeColors} />
						</g>
						<TextToSvgRenderer
							text={invite.guild.name}
							options={{
								fontSize: SERVER_NAME_SIZE,
								fill: themeColors.serverName,
							}}
							transform={`translate(${hasVerified || hasPartnered ? 20 : 0}, ${SERVER_NAME_SIZE})`}
							font={WhitneySemibold}
						/>

						{/* Presence */}
						<g transform={`translate(0, ${SERVER_NAME_LINE_HEIGHT + SERVER_NAME_MARGIN_BOTTOM})`}>
							<circle cx={PRESENCE_DOT_SIZE / 2} cy={PRESENCE_LINE_HEIGHT / 2} r={PRESENCE_DOT_SIZE / 2} fill={themeColors.online} />
							<TextToSvgRenderer
								text={locale.online.replace(
									'{{count}}',
									formatNumber(invite.approximate_presence_count ? invite.approximate_presence_count : 0)
								)}
								options={{
									fontSize: PRESENCE_FONT_SIZE,
									fill: themeColors.presenceText,
								}}
								transform={`translate(${PRESENCE_DOT_SIZE + PRESENCE_DOT_MARGIN_RIGHT}, ${
									PRESENCE_LINE_HEIGHT / 2 + PRESENCE_FONT_SIZE / 2 - 2.5
								})`}
								font={WhitneySemibold}
							/>

							<circle cx={allMembersMargin} cy={PRESENCE_LINE_HEIGHT / 2} r={PRESENCE_DOT_SIZE / 2} fill={themeColors.members} />
							<TextToSvgRenderer
								text={locale.members.replace(
									'{{count}}',
									formatNumber(invite.approximate_member_count ? invite.approximate_member_count : 0)
								)}
								options={{
									fontSize: PRESENCE_FONT_SIZE,
									fill: themeColors.presenceText,
								}}
								transform={`translate(${allMembersMargin + PRESENCE_DOT_SIZE}, ${PRESENCE_LINE_HEIGHT / 2 + PRESENCE_FONT_SIZE / 2 - 2.5})`}
								font={WhitneySemibold}
							/>
						</g>
					</g>
				</g>
			</svg>
		</svg>
	);
}

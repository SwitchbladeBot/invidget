import WhitneyMedium from '../../fonts/WhitneyMedium';
import { LegacyThemeColors } from '../../types/themes';
import { INVITE_WIDTH, PADDING, BUTTON_WIDTH, ICON_SIZE, BUTTON_HEIGHT, PRESENCE_FONT_SIZE } from './const';
import { TextToSvgRenderer } from './Font/TextToSvgRenderer';

type JoinButtonProps = {
	themeColors: LegacyThemeColors;
	text: string;
};

export default function JoinButton({ themeColors, text }: JoinButtonProps) {
	return (
		<>
				<rect
					x={INVITE_WIDTH - PADDING * 2 - BUTTON_WIDTH}
					y={(ICON_SIZE - BUTTON_HEIGHT) / 2}
					width={BUTTON_WIDTH}
					height={BUTTON_HEIGHT}
					rx={3}
					ry={3}
					fill={themeColors.joinButtonBackground}
				/>
				<TextToSvgRenderer
					text={text}
					options={{
						fontSize: PRESENCE_FONT_SIZE,
						fill: themeColors.joinButtonText,
						anchor: 'middle',
					}}
					transform={`translate(${INVITE_WIDTH - PADDING * 2 - BUTTON_WIDTH / 2}, ${
						(ICON_SIZE - BUTTON_HEIGHT) / 2 + BUTTON_HEIGHT / 2 + 5
					})`}
					font={WhitneyMedium}
				/>
		</>
	);
}

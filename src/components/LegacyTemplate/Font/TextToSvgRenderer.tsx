import opentype from 'opentype.js';

export type SvgTextOptions = {
	fontSize?: number;
	x?: number;
	y?: number;
	fill?: string;
	anchor?: 'start' | 'middle' | 'end';
	baseline?: 'top' | 'middle' | 'bottom';
};

export function TextToSvgRenderer({
	font,
	text,
	options = {},
  ...rest
}: { text: string; font: opentype.Font; options?: SvgTextOptions, } & React.SVGProps<SVGPathElement>) {
	const fontSize = options.fontSize ?? 72;
	let x = options.x ?? 0;
	let y = options.y ?? 0;
	const fill = options.fill ?? 'black';
	const anchor = options.anchor ?? 'start';
	const baseline = options.baseline ?? 'bottom';

	const path = font.getPath(text, 0, 0, fontSize);
	const box = path.getBoundingBox();
	const width = box.x2 - box.x1;
	const height = box.y2 - box.y1;

	if (anchor === 'middle') x -= width / 2;
	else if (anchor === 'end') x -= width;

	if (baseline === 'middle') y += height / 2;
	else if (baseline === 'top') y += height;

	const alignedPath = font.getPath(text, x, y, fontSize);
	const svgPath = alignedPath.toPathData(2);

	return <path d={svgPath} fill={fill} {...rest} />;
}

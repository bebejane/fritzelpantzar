'use client';

import s from './ImageAndTextRowBlock.module.scss';
import cn from 'classnames';
import Content from '@components/Content';
import { Image } from 'react-datocms';

export type LayoutProps = { data: ImageAndTextRowBlockRecord };

export default function ImageAndTextRowBlock({ data: { image, id, imageRight, text } }: LayoutProps) {
	return (
		<section className={s.imageAndTextRow}>
			<div className={s.left}>
				<div className={cn(s.desc, 'big')}>
					{imageRight ? (
						<Content content={text} />
					) : image.responsiveImage ? (
						<Image data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' intersectionThreshold={0} />
					) : null}
				</div>
			</div>
			<div className={cn(s.right, 'big')}>
				{!imageRight ? (
					<Content content={text} />
				) : image.responsiveImage ? (
					<Image data={image.responsiveImage} intersectionMargin='0px 0px 200% 0px' intersectionThreshold={0} />
				) : null}
			</div>
		</section>
	);
}

'use client';

import s from './MediaRowBlock.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import { VideoPlayer } from 'next-dato-utils/components';

export type LayoutProps = { data: MediaRowBlockRecord };

export default function MediaRowBlock({ data: { mediaAsset } }: LayoutProps) {
	return (
		<section className={s.mediaRow}>
			{mediaAsset.map((asset, i) =>
				asset.responsiveImage ? (
					<figure key={i} className={mediaAsset.length > 1 ? s.multi : s.single}>
						{asset.responsiveImage && (
							<Image data={asset.responsiveImage} intersectionMargin='0px 0px 200% 0px' intersectionThreshold={0} />
						)}
					</figure>
				) : asset.video ? (
					<VideoPlayer key={i} data={asset as FileField} className={mediaAsset.length > 1 ? s.multi : s.single} />
				) : null
			)}
		</section>
	);
}

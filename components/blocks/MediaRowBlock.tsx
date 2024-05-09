'use client'

import s from './MediaRowBlock.module.scss'
import cn from 'classnames'
import { Image } from 'react-datocms'

export type LayoutProps = { data: MediaRowBlockRecord }

export default function MediaRowBlock({ data: { mediaAsset } }: LayoutProps) {

	return (
		<section className={s.mediaRow}>
			{mediaAsset.map((asset, i) => (
				<figure key={i} className={mediaAsset.length > 1 ? s.multi : s.single}>
					<Image
						data={asset.responsiveImage}
						intersectionMargin="0px 0px 200% 0px"
					/>
				</figure>
			))}
		</section>
	)
}
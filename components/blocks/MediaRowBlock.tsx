'use client'

import s from './MediaRowBlock.module.scss'
import cn from 'classnames'
import React, { useRef, useState } from 'react'
import { Image } from 'react-datocms'

export type LayoutProps = { data: MediaRowBlockRecord }

export default function MediaRowBlock({ data: { mediaAsset } }: LayoutProps) {

	return (
		<section className={s.mediaRow}>
			{mediaAsset.map((asset, i) => (
				<Image data={asset.responsiveImage} />
			))}
		</section>
	)
}
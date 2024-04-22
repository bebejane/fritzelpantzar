'use client'

import s from './SelectedProjectBlock.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { Image } from 'react-datocms'

export type LayoutProps = { data: SelectedProjectBlockRecord }

export default function SelectedProjectBlock({ data: { image, project } }: LayoutProps) {

	return (
		<section className={s.selectedProject}>
			<Link href={`/projects/${project.slug}`} scroll={false} prefetch={true}>
				<Image
					data={image.responsiveImage}
					fadeInDuration={0}
					intersectionMargin="0px 0px 2000px 0px"
				/>
			</Link>
		</section>
	)
}
'use client'

import s from './StaffBlock.module.scss'
import { Image } from 'react-datocms'

export type LayoutProps = { data: StaffRecord }

export default function StaffBlock({ data: { people } }: LayoutProps) {

	return (
		<ul className={s.staff}>
			{people.map((staff, i) =>
				<li key={i}>
					<Image data={staff.image?.responsiveImage} />
				</li>
			)}
		</ul>
	)
}
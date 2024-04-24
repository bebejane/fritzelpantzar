'use client'

import s from './StaffBlock.module.scss'
import { Image } from 'react-datocms'

export type LayoutProps = { data: StaffBlockRecord }

export default function StaffBlock({ data: { people } }: LayoutProps) {

	return (
		<ul className={s.staff}>
			{people.map(({ id, image, firstName, lastName, phone, email, title }) =>
				<li key={id}>
					<Image data={image?.responsiveImage} />
					{firstName} {lastName}
					{title && <span>{title}</span>}
					{phone && <a href={`tel:${phone}`}>{phone}</a>}
					{email && <a href={`mailto:${email}`}>{email}</a>}
				</li>
			)}
		</ul>
	)
}
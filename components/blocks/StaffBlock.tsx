'use client'

import s from './StaffBlock.module.scss'
import { Image } from 'react-datocms'

export type LayoutProps = { data: StaffBlockRecord }

export default function StaffBlock({ data: { people } }: LayoutProps) {

	return (
		<ul className={s.staff}>
			{people.map(({ id, image, firstName, lastName, phone, email, title }) =>
				<li key={id}>
					<figure>
						<Image data={image?.responsiveImage} />
					</figure>
					{firstName} {lastName}<br />
					{title && <span>{title}</span>}<br />
					{phone && <a href={`tel:${phone}`}>{phone}</a>}<br />
					{email && <a href={`mailto:${email}`}>{email}</a>}<br />
				</li>
			)}
		</ul>
	)
}
'use client';

import s from './About.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { Image } from 'react-datocms';
import Content from './Content';

export type Props = {
	data: AboutQuery['about'];
	modal: boolean;
};

export default function About({ data: { image, address, content }, modal }: Props) {
	const [showAbout] = useStore((state) => [state.showAbout]);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (modal) document.querySelector('main').classList.toggle('slided', showAbout);
		if (showAbout) ref.current.scrollTop = 0;
	}, [modal, showAbout]);

	return (
		<div className={cn(s.about, modal && s.modal, showAbout && s.open, 'cursor-white')} ref={ref}>
			<div className={s.content}>
				<img className={s.logo} src='/images/logo.svg' alt='Logo' />
				<div className={s.address}>{address}</div>
				{image?.responsiveImage && (
					<figure>
						<Image
							data={image.responsiveImage}
							usePlaceholder={false}
							priority={true}
							intersectionMargin='0px 0px 200% 0px'
							intersectionThreshold={0}
						/>
					</figure>
				)}
				<Content className={cn('big', s.text)} content={content} />
			</div>
		</div>
	);
}

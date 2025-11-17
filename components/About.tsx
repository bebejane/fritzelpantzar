'use client';

import s from './About.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useStore, useShallow } from '@/lib/store';
import { Image } from 'react-datocms';
import Content from './Content';

export type Props = {
	data: AboutQuery['about'];
	modal: boolean;
};

export default function About({ data, modal }: Props) {
	const [showAbout] = useStore(useShallow((state) => [state.showAbout]));
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		!modal && window.scrollTo(0, 0);
	}, [modal]);

	useEffect(() => {
		const main = document.querySelector('main');
		console.log(modal, showAbout);
		main?.classList.toggle('slided', modal && showAbout);
		if (modal && ref.current) ref.current.scrollTop = 0;
	}, [modal, showAbout]);

	if (!data) return null;

	const { image, address, content } = data;

	return (
		<div
			id={modal ? 'about-modal' : 'about'}
			className={cn(s.about, modal && s.modal, showAbout && s.open, 'cursor-white')}
			ref={ref}
		>
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

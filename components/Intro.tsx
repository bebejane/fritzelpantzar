'use client';

import s from './Intro.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { useStore, useShallow } from '@/lib/store';
import { usePathname } from 'next/navigation';
import useIsDesktop from '../lib/hooks/useIsDesktop';

const symbolSpace = '2vw';
const symbolSpaceMobile = '2.55vw';
const logoFLeftPerc = 1.062;
const logoPLeftPerc = 1.995;
const logoFLeftPercMobile = 1.128;
const logoPLeftPercMobile = 3.04;

const logoPWidthMobileOrg = 0.0247;
const logoFWidthMobileOrg = 0.0215;
const logoPWidthOrg = 0.026;
const logoFWidthOrg = 0.0255;

function getOffset(el: any) {
	var _x = 0;
	var _y = 0;
	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: _y, left: _x };
}

export default function Intro() {
	const ref = useRef<HTMLImageElement>(null);
	const f = useRef<HTMLImageElement>(null);
	const p = useRef<HTMLImageElement>(null);

	const pathname = usePathname();
	const [inIntro] = useStore(useShallow((state) => [state.inIntro]));
	const [logoFStyle, setLogoFStyle] = useState<any | null>(null);
	const [logoPStyle, setLogoPStyle] = useState<any | null>(null);
	const { width, height } = useWindowSize();
	const { scrolledPosition, viewportHeight, isScrolling } = useScrollInfo();
	const isDesktop = useIsDesktop();
	const logoFHeight = useRef<number | null>(null);
	const logoPHeight = useRef<number | null>(null);

	const updateStyles = async () => {
		const logo = ref.current;
		const logoF = f.current;
		const logoP = p.current;

		if (!logo || !logoF || !logoP) return console.warn('Logo not found');

		const menuF = document.getElementById('menu-f');
		const menuP = document.getElementById('menu-p');

		if (!menuF || !menuP) return console.warn('Menu not found');

		const logoFBounds = logoF.getBoundingClientRect();
		const logoPBounds = logoP.getBoundingClientRect();

		const menuFBounds = menuF.getBoundingClientRect();
		const menuPBounds = menuP.getBoundingClientRect();
		const menuFTop = menuFBounds.top;
		const menuPTop = menuPBounds.top;

		const ratio = Math.max(0, Math.min(scrolledPosition / viewportHeight, 1));
		const bounds = logo.getBoundingClientRect();
		const pLeftPerc = isDesktop ? logoPLeftPerc : logoPLeftPercMobile;
		const fLeftPerc = isDesktop ? logoFLeftPerc : logoFLeftPercMobile;

		logoFHeight.current = logoFHeight.current ?? logoFBounds.height;
		logoPHeight.current = logoPHeight.current ?? logoPBounds.height;

		const scale = 1 + ((menuFBounds.height - logoFHeight.current) / logoFHeight.current) * ratio;
		const logoFLeftEnd = menuFBounds.left;
		const logoPLeftEnd = menuPBounds.left;
		const padTop = isDesktop ? 0 : 10;
		const padLeft = isDesktop ? 0 : 6;
		const logoFTop = bounds.top + (menuFTop - bounds.top + padTop) * ratio;
		const logoPTop = bounds.top + (menuPTop - bounds.top + padTop) * ratio;
		const logoFLeft = (logoFLeftEnd - bounds.left * fLeftPerc + padLeft) * ratio + bounds.left * fLeftPerc;
		const logoPLeft = (logoPLeftEnd - bounds.left * pLeftPerc + padLeft) * ratio + bounds.left * pLeftPerc;

		const baseStyle = {
			transform: `rotate(${ratio * 360}deg) scale(${scale})`,
			opacity: !inIntro ? 0 : 1,
		};

		setLogoFStyle({
			...baseStyle,
			top: `${logoFTop}px`,
			left: `${logoFLeft}px`,
		});

		setLogoPStyle({
			...baseStyle,
			top: `${logoPTop}px`,
			left: `${logoPLeft}px`,
		});

		logo.style.opacity = !inIntro ? '0' : '1';
	};

	useEffect(() => {
		updateStyles();
	}, [isDesktop, scrolledPosition, viewportHeight, width, height, inIntro, pathname, isScrolling]);

	const handleClick = () => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });

	return (
		<>
			<div className={s.intro} onClick={handleClick}>
				<img
					id='logo'
					className={cn(s.logo, ((!logoFStyle && isDesktop) || !inIntro || !logoPStyle) && s.hidden)}
					onLoad={updateStyles}
					src={isDesktop ? '/images/logo-stripped.svg' : '/images/logo-stripped-mobile.svg'}
					alt='Logo'
					ref={ref}
				/>
			</div>
			<img id='logo-f' className={s.f} style={logoFStyle} src='/images/logo-f.svg' ref={f} />
			<img id='logo-p' className={s.p} style={logoPStyle} src='/images/logo-p.svg' ref={p} />
		</>
	);
}

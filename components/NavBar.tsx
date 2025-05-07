'use client';

import s from './NavBar.module.scss';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '../lib/store';
import { useEffect, useState } from 'react';
import useIsDesktop from '@lib/hooks/useIsDesktop';
import { awaitElement } from '@/lib/utils';

export default function NavBar() {
	const [showAbout, setShowAbout, setHoverAbout, hoverAbout, inOverview, inIntro] = useStore(
		(state) => [
			state.showAbout,
			state.setShowAbout,
			state.setHoverAbout,
			state.hoverAbout,
			state.inOverview,
			state.inIntro,
		]
	);
	const router = useRouter();
	const pathname = usePathname();
	const isHome = pathname === '/';
	const isDesktop = useIsDesktop();
	const isClose = !isHome || showAbout;
	const [invert, setInvert] = useState(false);
	const [isModal, setIsModal] = useState(false);

	const handleClick = () => {
		if (pathname === '/about' || (!isModal && !isHome)) router.push('/');
		else if (!isHome) router.back();
		else setShowAbout(!showAbout);
	};

	useEffect(() => {
		if (pathname === '/about') return setInvert(true);
		if (showAbout) setInvert(showAbout);
		else setTimeout(() => setInvert(showAbout), 300);
	}, [showAbout, pathname]);

	useEffect(() => {
		const checkModal = async () => {
			const m = await awaitElement('#modal', 300);
			setIsModal(m ? true : false);
		};
		checkModal();
	}, [pathname]);

	return (
		<>
			<nav
				className={cn(s.navbar, inIntro && isModal && s.inactive, isClose && s.closed)}
				key={pathname}
				onMouseEnter={() => isDesktop && setHoverAbout(true)}
				onMouseLeave={() => isDesktop && setHoverAbout(false)}
			>
				<button onClick={handleClick} id='menu' className={cn(inIntro && s.intro)}>
					<img
						id='menu-f'
						src='/images/logo-f-blue.svg'
						alt='Menu'
						className={cn(s.icon, s.menu)}
					/>
					<img
						id='menu-p'
						src='/images/logo-p-blue.svg'
						alt='Menu'
						className={cn(s.icon, s.menu)}
					/>
				</button>
				<button onClick={handleClick} className={cn(inIntro && s.intro)}>
					<img
						key={`${invert}`}
						src={`/images/close${invert ? '-white' : ''}.svg`}
						alt='Close'
						className={cn(s.icon, s.close)}
					/>
				</button>
			</nav>
			<div className={cn(s.tooltip, hoverAbout && !showAbout && isHome && s.show)}>
				<h2>Info & Kontakt</h2>
			</div>
		</>
	);
}

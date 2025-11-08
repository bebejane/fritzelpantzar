'use client';

import s from './NavBar.module.scss';
import cn from 'classnames';
import { useRouter, usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { useStore, useShallow } from '@/lib/store';
import { useEffect, useState } from 'react';
import useIsDesktop from '@lib/hooks/useIsDesktop';
import { awaitElement } from '@/lib/utils';
import Link from 'next/link';
import { sleep } from 'next-dato-utils/utils';

export default function NavBar() {
	const [showAbout, setShowAbout, setHoverAbout, hoverAbout, inOverview, inIntro] = useStore(
		useShallow((state) => [
			state.showAbout,
			state.setShowAbout,
			state.setHoverAbout,
			state.hoverAbout,
			state.inOverview,
			state.inIntro,
		])
	);
	const router = useRouter();
	const pathname = usePathname();
	const segment = useSelectedLayoutSegment();
	const isHome = pathname === '/';
	const isDesktop = useIsDesktop();
	const [invert, setInvert] = useState(false);
	const [isModal, setIsModal] = useState(false);
	const isClose = !isHome || showAbout;

	const handleClose = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (showAbout && isModal) {
			e.preventDefault();
			setShowAbout(false);
			await sleep(400);
			router.back();
		} else !segment && router.back();
	};

	useEffect(() => {
		setInvert(pathname === '/about');
		setShowAbout(pathname === '/about');
		awaitElement('#about-modal', 500).then((m) => setIsModal(m ? true : false));
	}, [pathname]);

	return (
		<>
			<nav
				className={cn(s.navbar, inIntro && isModal && s.inactive, isClose && s.closed)}
				key={pathname}
				onMouseEnter={() => isDesktop && setHoverAbout(true)}
				onMouseLeave={() => isDesktop && setHoverAbout(false)}
			>
				{!isClose ? (
					<Link href='/about' scroll={false} prefetch={true}>
						<button id='menu' className={cn(s.button, inIntro && s.intro)}>
							<img id='menu-f' src='/images/logo-f-blue.svg' alt='Menu' className={cn(s.icon, s.menu)} />
							<img id='menu-p' src='/images/logo-p-blue.svg' alt='Menu' className={cn(s.icon, s.menu)} />
						</button>
					</Link>
				) : (
					<Link href='/' scroll={true} onClick={handleClose}>
						<button className={cn(s.button, inIntro && isHome && s.intro)}>
							<img
								key={`${invert}`}
								src={`/images/close${invert ? '-white' : ''}.svg`}
								alt='Close'
								className={cn(s.icon, s.close)}
							/>
						</button>
					</Link>
				)}
			</nav>
			<div className={cn(s.tooltip, hoverAbout && !showAbout && isHome && s.show)}>
				<h2>Info & Kontakt</h2>
			</div>
		</>
	);
}

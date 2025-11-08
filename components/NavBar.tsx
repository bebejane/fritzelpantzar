'use client';

import s from './NavBar.module.scss';
import cn from 'classnames';
import { useRouter, usePathname, useSelectedLayoutSegments, useSelectedLayoutSegment } from 'next/navigation';
import { useStore, useShallow } from '@/lib/store';
import { useEffect, useState } from 'react';
import useIsDesktop from '@/lib/hooks/useIsDesktop';
import Link from 'next/link';
import { sleep } from 'next-dato-utils/utils';
import { Modal } from 'next-dato-utils/components';

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
	const isHome = pathname === '/';
	const projectSegments = useSelectedLayoutSegments('project');
	const aboutSegments = useSelectedLayoutSegments('about');
	const projectSegment = useSelectedLayoutSegments('project');
	const aboutSegment = useSelectedLayoutSegments('about');

	const isDesktop = useIsDesktop();
	const [invert, setInvert] = useState(false);
	const [modal, setModal] = useState<'about' | 'project' | null>(null);
	const isClose = !isHome || showAbout;

	const handleClose = async (e?: React.MouseEvent<HTMLAnchorElement>) => {
		if (!modal) return;
		if (modal === 'about') {
			e?.preventDefault();
			setShowAbout(false);
			await sleep(400);
		}
		router.back();
	};

	useEffect(() => {
		console.log({ projectSegments, aboutSegments, aboutSegment, projectSegment, pathname });
		setModal(projectSegments.includes('(.)projects') ? 'project' : aboutSegments.includes('(.)about') ? 'about' : null);
	}, [projectSegments, aboutSegments, aboutSegment, projectSegment, pathname]);

	useEffect(() => {
		setInvert(pathname === '/about');
		setShowAbout(pathname === '/about');
	}, [pathname]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			e.key === 'Escape' && handleClose();
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [modal]);

	return (
		<>
			<nav
				className={cn(s.navbar, inIntro && showAbout && modal === 'about' && s.inactive, isClose && s.closed)}
				key={pathname}
				onMouseEnter={() => isDesktop && setHoverAbout(true)}
				onMouseLeave={() => isDesktop && setHoverAbout(false)}
			>
				<Link href='/about' scroll={false} className={cn(modal && s.hidden)}>
					<button id='menu' className={cn(s.button, inIntro && s.intro)}>
						<img id='menu-f' src='/images/logo-f-blue.svg' alt='Menu' className={cn(s.icon, s.menu)} />
						<img id='menu-p' src='/images/logo-p-blue.svg' alt='Menu' className={cn(s.icon, s.menu)} />
					</button>
				</Link>

				<Link href='/' scroll={true} onClick={handleClose} className={cn(!modal && !isClose && s.hidden)}>
					<button className={cn(s.button, inIntro && isHome && s.intro)}>
						<img
							key={`${invert}`}
							src={`/images/close${invert ? '-white' : ''}.svg`}
							alt='Close'
							className={cn(s.icon, s.close)}
						/>
					</button>
				</Link>
			</nav>
			<div className={cn(s.tooltip, hoverAbout && !showAbout && isHome && s.show)}>
				<h2>Info & Kontakt</h2>
			</div>
			{/* <div className={s.status}>{modal ? modal : 'none'}</div> */}
		</>
	);
}

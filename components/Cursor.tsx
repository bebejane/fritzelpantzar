'use client';
import cn from 'classnames';
import s from './Cursor.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'react-use';
import { useStore, useShallow } from '@/lib/store';
import { usePathname } from 'next/navigation';
import useIsDesktop from '../lib/hooks/useIsDesktop';

const leftDotPercentage = 0.14;
const cursorSizeDivider = 45;
const transitionTime = 400;

type CursorStyle = {
	top: number;
	left: number;
	width: number;
	height: number;
	transitionDuration: number;
};

const cursorStyle: CursorStyle = {
	top: -16,
	left: -16,
	width: 16,
	height: 16,
	transitionDuration: transitionTime,
};

export default function Cursor() {
	const { width, height } = useWindowSize();
	const [init, setInit] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(false);
	const [ready, setReady] = useState<boolean>(false);
	const [showAbout, inIntro] = useStore(useShallow((state) => [state.showAbout, state.inIntro]));
	const [cursorColor, setCursorColor] = useState<'white' | 'blue'>('white');
	const pathname = usePathname();
	const isHome = pathname === '/';
	const ref = useRef<HTMLImageElement>(null);
	const timeout = useRef<NodeJS.Timeout | null>(null);
	const isDesktop = useIsDesktop();

	const setStyle = (style: CursorStyle) => {
		ref.current?.style.setProperty('top', `${style.top}px`);
		ref.current?.style.setProperty('left', `${style.left}px`);
		ref.current?.style.setProperty('width', `${style.width}px`);
		ref.current?.style.setProperty('height', `${style.height}px`);
		ref.current?.style.setProperty('transition-duration', `${style.transitionDuration}ms`);
	};

	const initStyle = () => {
		setInit(false);
		setReady(false);

		const logo = document.getElementById('logo');
		const bounds = logo?.getBoundingClientRect();

		if (!logo) {
			setInit(true);
			setReady(true);
			setHidden(false);
			return;
		}

		setStyle({
			...cursorStyle,
			top: bounds.top - 2,
			left: bounds.left + bounds.width * leftDotPercentage,
		});

		setTimeout(() => setInit(true), 100);
	};

	const handleMouseLeave = () => setHidden(true);
	const handleMouseEnter = () => setHidden(false);
	const handleMouse = (e: MouseEvent) => {
		setStyle({
			...cursorStyle,
			top: e.clientY - cursorStyle.height / 2,
			left: e.clientX - cursorStyle.width / 2,
		});

		if (hidden) setHidden(false);

		if (init && !ready) {
			clearTimeout(timeout.current);
			timeout.current = setTimeout(() => setReady(true), transitionTime);
		}
	};

	useEffect(() => {
		if (!init) initStyle();

		document.addEventListener('mousemove', handleMouse);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			document.removeEventListener('mousemove', handleMouse);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
		};
	}, [isDesktop, init, ready]);

	useEffect(() => {
		const logo = document.getElementById('logo') as HTMLImageElement;
		const bounds = logo?.getBoundingClientRect();
		const size = bounds ? bounds.width / cursorSizeDivider : 16;

		setStyle({
			...cursorStyle,
			width: size,
			height: size,
		});
	}, [width, height, init, ready]);

	useEffect(() => {
		setCursorColor(showAbout || inIntro || pathname === '/about' ? 'white' : 'blue');
	}, [pathname, showAbout, inIntro]);

	return (
		<img
			ref={ref}
			className={cn(s.cursor, init && s.init, ready && s.ready, hidden && s.hidden)}
			src={`/images/cursor-${cursorColor}.svg`}
		/>
	);
}

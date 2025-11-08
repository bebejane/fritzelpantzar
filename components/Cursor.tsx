'use client';
import cn from 'classnames';
import s from './Cursor.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'react-use';
import { useStore, useShallow } from '@/lib/store';
import { usePathname } from 'next/navigation';
import useIsDesktop from '../lib/hooks/useIsDesktop';

declare module 'react' {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}

const leftDotPercentage = 0.14;
const cursorSizeDivider = 45;
const transitionTime = 300;

type CursorStyle = {
	top: number;
	left: number;
	width: number;
	height: number;
};

const cursorStyle: CursorStyle = {
	top: -16,
	left: -16,
	width: 16,
	height: 16,
};

export default function Cursor() {
	const { width, height } = useWindowSize();
	const [init, setInit] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(false);
	const [ready, setReady] = useState<boolean>(false);
	const [showAbout, inIntro] = useStore(useShallow((state) => [state.showAbout, state.inIntro]));
	const [cursorColor, setCursorColor] = useState<'white' | 'blue'>('white');
	const pathname = usePathname();
	const ref = useRef<HTMLImageElement>(null);
	const isDesktop = useIsDesktop();

	const setStyle = (style: Partial<CursorStyle>) => {
		Object.keys(style).forEach((key) => {
			ref.current?.style.setProperty(key, `${style[key as keyof CursorStyle]}px`);
		});
	};

	const initStyle = () => {
		setInit(false);
		setReady(false);

		const logo = document.getElementById('logo');
		if (!logo) {
			setInit(true);
			setReady(true);
			setHidden(false);
			return;
		}

		const bounds = logo.getBoundingClientRect();
		setStyle({
			top: bounds.top - 2,
			left: bounds.left + bounds.width * leftDotPercentage,
		});

		setTimeout(() => {
			setInit(true);
		}, transitionTime);
	};

	const handleMouseLeave = () => setHidden(true);
	const handleMouseEnter = () => setHidden(false);
	const handleMouseMove = (e: MouseEvent) => {
		setStyle({
			top: e.clientY - cursorStyle.height / 2,
			left: e.clientX - cursorStyle.width / 2,
		});

		if (hidden) setHidden(false);

		if (init && !ready) {
			setTimeout(() => setReady(true), transitionTime);
		}
	};

	useEffect(() => {
		if (!init) initStyle();

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);
		};
	}, [init, isDesktop, ready]);

	useEffect(() => {
		const logo = document.getElementById('logo') as HTMLImageElement;
		const bounds = logo?.getBoundingClientRect();
		const size = bounds ? bounds.width / cursorSizeDivider : 16;

		setStyle({
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
			style={{ '--transition-time': `${transitionTime}ms` }}
			src={`/images/cursor-${cursorColor}.svg`}
		/>
	);
}

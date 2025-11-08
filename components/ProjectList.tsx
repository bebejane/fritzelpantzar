'use client';

import s from './ProjectList.module.scss';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import useIsDesktop from '../lib/hooks/useIsDesktop';
import { useStore, useShallow } from '@/lib/store';
import { Image, SRCImage } from 'react-datocms';
import Link from 'next/link';
import { VideoPlayer } from 'next-dato-utils/components';
import { set } from 'zod';

export type Props = {
	items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
	position: 'left' | 'right' | 'center';
	onHover: (project: ProjectRecord, position: 'left' | 'right' | 'center') => void;
	ready: boolean;
	project: ProjectRecord | null;
};

export default function ProjectList({ items, position, project, onHover, ready = false }: Props) {
	const ref = useRef<HTMLUListElement>(null);
	const oppositeRef = useRef<HTMLUListElement>(null);
	const lastScrollRef = useRef<number>(null);
	const lastScrollTimeRef = useRef<number>(new Date().getTime());
	const scrollTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const [showAbout, inIntro, hoverPosition, setHoverPosition] = useStore(
		useShallow((state) => [state.showAbout, state.inIntro, state.hoverPosition, state.setHoverPosition])
	);
	const isDesktop = useIsDesktop();
	const [isScrolling, setIsScrolling] = useState<boolean>(false);
	const isHovering = hoverPosition === position;
	const vitems = items.concat(items).concat(items);

	useEffect(() => {
		const id = ['left', 'right'].includes(position) ? (position === 'left' ? 'right' : 'left') : 'center';
		oppositeRef.current = document.getElementById(`projects-${id}`) as HTMLUListElement;
		ref.current.scrollTop = ref.current.scrollHeight / 3;
	}, []);

	useEffect(() => {
		if (inIntro) return;

		const container = ref.current;
		container.addEventListener('scroll', handleScroll);
		return () => container?.removeEventListener('scroll', handleScroll);
	}, [inIntro, isHovering, isDesktop]);

	const handleScroll = (e: Event) => {
		const target = ref.current;
		const { scrollTop, scrollHeight } = target;
		const originalScrollHeight = scrollHeight / 3;

		if (scrollTop < originalScrollHeight) {
			target.scrollTop = scrollTop + originalScrollHeight;
		} else if (scrollTop >= originalScrollHeight * 2) {
			target.scrollTop = scrollTop - originalScrollHeight;
		}

		if (isHovering && oppositeRef.current) {
			const delta = scrollTop - (lastScrollRef.current || scrollTop);
			lastScrollRef.current = scrollTop;

			requestAnimationFrame(() => {
				oppositeRef.current.scrollTop -= delta;
			});
		}

		clearTimeout(scrollTimeIntervalRef.current);
		setIsScrolling(true);
		scrollTimeIntervalRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, 100);
	};

	const handleMouseLeave = () => !isScrolling && setHoverPosition(null);
	const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement;
		if (isDesktop && !isScrolling) {
			const index = parseInt(target.dataset.blockIndex);
			if (isNaN(index)) return;
			onHover(vitems[index].project as ProjectRecord, position);
		}
	};

	const handleMouseOver = (e: React.MouseEvent<HTMLUListElement>) => {
		if (!isDesktop || !ready || isScrolling) return;
		setHoverPosition(position);
	};

	return (
		<ul
			id={`projects-${position}`}
			className={cn(s.projects, ready && s.ready, showAbout && s.inactive)}
			onMouseEnter={handleMouseOver}
			onMouseMove={handleMouseOver}
			onWheel={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			ref={ref}
		>
			{vitems.map((block, index) => {
				const active = project && block.project?.id === project?.id && isHovering;
				return (
					<li
						id={`${position}_${index - items.length}`}
						key={index}
						className={cn(!active && s.unfocused)}
						data-block-index={index}
						onMouseEnter={handleMouseEnter}
					>
						<Link href={`/projects/${block.project.slug}`} scroll={false} prefetch={true}>
							{block.image.responsiveImage ? (
								<SRCImage data={block.image.responsiveImage} />
							) : block.image.mimeType.includes('video') ? (
								<VideoPlayer data={block.image as FileField} className={s.video} />
							) : null}
							<h2 className={cn(s.title, active && s.show)}>{block.project.title}</h2>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

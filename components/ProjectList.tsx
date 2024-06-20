'use client'

import s from './ProjectList.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react';
import useIsDesktop from '../lib/hooks/useIsDesktop';
import { useStore } from '../lib/store';
import { Image } from 'react-datocms';
import Link from 'next/link';

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  position: 'left' | 'right' | 'center'
  onHover: (project: ProjectRecord, position: 'left' | 'right' | 'center') => void
  ready: boolean
  project: ProjectRecord | null
}

export default function ProjectList({ items, position, project, onHover, ready = false }: Props) {

  const ref = useRef<HTMLUListElement>(null)
  const oppositeRef = useRef<HTMLUListElement>(null)
  const lastScrollRef = useRef<number>(null)
  const [hover, setHover] = useState(false)
  const [showAbout, inIntro] = useStore((state) => [state.showAbout, state.inIntro])
  const isDesktop = useIsDesktop()

  const vitems = items.concat(items).concat(items)

  useEffect(() => {
    const id = ['left', 'right'].includes(position) ? position === 'left' ? 'right' : 'left' : 'center'
    oppositeRef.current = document.getElementById(`projects-${id}`) as HTMLUListElement
    ref.current.scrollTop = (ref.current.scrollHeight / 3)
  }, [])

  useEffect(() => {

    if (inIntro) return
    const container = ref.current;
    container.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [inIntro, hover, isDesktop])

  const handleScroll = (e: React.WheelEvent<HTMLUListElement> | Event) => {

    const target = ref.current
    const { scrollTop, scrollHeight } = target
    const originalScrollHeight = (scrollHeight / 3)
    const top = scrollTop < originalScrollHeight
    const bottom = (scrollTop) - (originalScrollHeight * 2) >= 0

    if (bottom)
      target.scrollTop = scrollTop - originalScrollHeight
    else if (top)
      target.scrollTop = scrollTop + originalScrollHeight

    if (!hover) return

    if (lastScrollRef.current === null)
      lastScrollRef.current = scrollTop
    else {
      oppositeRef.current.scrollTop = oppositeRef.current.scrollTop - (scrollTop - lastScrollRef.current)
      lastScrollRef.current = (bottom || top) ? target.scrollTop : scrollTop
    }
    setHover(true)
  }

  const handleMouse = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!isDesktop) return
    const hover = (e.type === 'mouseenter' || e.type === 'mouseover' || e.type === 'scroll')
    setHover(hover)
  }

  return (
    <ul
      id={`projects-${position}`}
      className={cn(s.projects, ready && s.ready, showAbout && s.inactive)}
      onMouseEnter={handleMouse}
      onMouseLeave={handleMouse}
      ref={ref}
    >
      {vitems.map((block, index) => {
        const active = project && block.project?.id === project?.id && hover
        return (
          <li
            id={`${position}_${index - items.length}`}
            key={index}
            className={cn(!active && s.unfocused)}
            onMouseEnter={() => isDesktop && onHover(block.project as ProjectRecord, position)}
          >
            <Link href={`/projects/${block.project.slug}`} scroll={false} prefetch={true}>
              <Image
                data={block.image.responsiveImage}
                fadeInDuration={0}
                usePlaceholder={false}
                priority={true}
                intersectionMargin="0px 0px 200% 0px"
              />
              <h2 className={cn(s.title, active && s.show)}>
                {block.project.title}
              </h2>
            </Link>
          </li>
        )
      }
      )}
    </ul>
  )
}
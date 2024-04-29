'use client'

import s from './ProjectList.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import { useEffect, useRef, useState } from 'react';
import useIsDesktop from '../lib/hooks/useIsDesktop';
import { useStore } from '../lib/store';

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  position: 'left' | 'right'
  onHover: (project: ProjectRecord, position: 'left' | 'right') => void
  ready: boolean
  project: ProjectRecord | null
}

export default function ProjectList({ items, position, project, onHover, ready = false }: Props) {


  const ref = useRef<HTMLUListElement>(null)
  const oppositeRef = useRef<HTMLUListElement>(null)
  const lastScrollRef = useRef<number>(null)
  const [hover, setHover] = useState(false)
  const [showAbout] = useStore((state) => [state.showAbout])
  const isDesktop = useIsDesktop()

  const vitems = isDesktop ? items.concat(items).concat(items) : items

  useEffect(() => {
    oppositeRef.current = document.getElementById(`projects-${position === 'left' ? 'right' : 'left'}`) as HTMLUListElement
    ref.current.scrollTop = (ref.current.scrollHeight / 3)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    ref.current.addEventListener('scroll', handleScroll)
    return () => ref.current?.removeEventListener('scroll', handleScroll)
  }, [hover, isDesktop])

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
  }

  return (
    <ul
      id={`projects-${position}`}
      className={cn(s.projects, ready && s.ready, showAbout && s.inactive)}
      onMouseEnter={() => isDesktop && setHover(true)}
      onMouseLeave={() => isDesktop && setHover(false)}
      ref={ref}
    >
      {vitems.map((block, index) =>
        <li
          id={`${position}.${index - items.length}`}
          key={index}
          className={cn(project && block.project?.id !== project?.id && s.unfocused)}
          onMouseEnter={() => isDesktop && onHover(block.project as ProjectRecord, position)}
        >
          <Block data={block} components={Blocks} />
        </li>
      )}
    </ul>
  )
}
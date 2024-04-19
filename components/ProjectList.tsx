'use client'

import s from './ProjectList.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import { useEffect, useRef } from 'react';

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  position: 'left' | 'right'
  onHover: (title: string) => void
  ready: boolean
}

export default function ProjectList({ items, position, onHover, ready = false }: Props) {

  const vitems = items.concat(items).concat(items)
  const ref = useRef<HTMLUListElement>(null)
  const oppositeRef = useRef<HTMLUListElement>(null)
  const lastScrollRef = useRef<number>(null)


  const handleScroll = (e: React.WheelEvent<HTMLUListElement> | Event) => {

    const target = ref.current
    const bottom = (target.scrollTop + target.clientHeight) - ((target.scrollHeight / 3) * 2) >= 0
    const top = target.scrollTop < Math.floor((target.scrollHeight / 3))
    const scrollTop = target.scrollTop

    if (bottom)
      target.scrollTop = scrollTop - Math.floor(((target.scrollHeight / 3)))
    else if (top) {
      target.scrollTop = scrollTop + Math.floor(((target.scrollHeight / 3)))
    }

    if (e.type === 'wheel') {
      if (lastScrollRef.current === null) {
        lastScrollRef.current = scrollTop
      } else {
        oppositeRef.current.scrollTop = oppositeRef.current.scrollTop - (scrollTop - lastScrollRef.current)
        lastScrollRef.current = (bottom || top) ? target.scrollTop : scrollTop
      }
    }
  }

  useEffect(() => {

    oppositeRef.current = document.getElementById(`projects-${position === 'left' ? 'right' : 'left'}`) as HTMLUListElement
    ref.current.scrollTop = ref.current.scrollHeight / 3
    ref.current.addEventListener('scroll', handleScroll)
    return () => ref.current.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ul
      id={`projects-${position}`}
      className={cn(s.projects, ready && s.ready)}
      onWheel={handleScroll}
      ref={ref}
    >
      {vitems.map((block, index) =>
        <li
          id={`${position}.${index - items.length}`}
          key={index}
          onMouseEnter={() => onHover(block.project.title)}
        >
          <Block data={block} components={Blocks} />
        </li>
      )}
    </ul >
  )
}
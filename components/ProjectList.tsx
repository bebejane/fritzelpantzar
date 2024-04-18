'use client'

import s from './ProjectList.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import { useEffect, useRef, useState } from 'react';

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  position: 'left' | 'right'
  onHover: (title: string) => void
  active: boolean
}

export default function ProjectList({ items, position, onHover, active = false }: Props) {

  const vitems = items.concat(items).concat(items)
  const ref = useRef<HTMLUListElement>(null)

  const handleScroll = (e: React.WheelEvent<HTMLUListElement>) => {
    const target = e.target as HTMLUListElement
    const bottom = (target.scrollTop + target.clientHeight) - ((target.scrollHeight / 3) * 2) > 0
    const top = target.scrollTop < Math.floor(((target.scrollHeight / 3) * 1))
    if (bottom)
      target.scrollTop = document.getElementById(`${position}.-1`)!.offsetTop
    //else if (top)
    //target.scrollTop = document.getElementById(`${position}.${items.length - 1}`)!.offsetTop

  }

  useEffect(() => {
    //if (ref.current)
    ref.current.scrollTop = ref.current.scrollHeight / 3
    //ref.current.scrollTop = document.getElementById(`${position}.-1`)!.offsetTop
  }, [])


  return (
    <ul className={cn(s.projects, active && s.ready)} onScroll={handleScroll} ref={ref}>
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
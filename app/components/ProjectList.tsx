'use client'

import s from './ProjectList.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  postition: 'left' | 'right'
  onHover: (title: string) => void
  active: boolean
}

export default function ProjectList({ items, postition, onHover, active = false }: Props) {

  /*
  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    const bottom = e.target.scrollHeight
      - e.target.scrollTop === e.target.clientHeight
    if (bottom) {
      e.target.scrollTop = 0
    }

  }
*/

  return (
    <ul className={cn(s.projects, active && s.ready)}>
      {items.map((block, index) =>
        <li key={index} onMouseEnter={() => onHover(block.project.title)}>
          <Block data={block} components={Blocks} />
        </li>
      )}
    </ul >
  )
}
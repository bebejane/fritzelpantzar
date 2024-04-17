'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks'; import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const [title, setTitle] = useState<string | null>(null)
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const isHome = usePathname() === '/';
  const isReady = scrolledPosition && scrolledPosition >= viewportHeight

  useEffect(() => {
    if (scrolledPosition < (viewportHeight / 2))
      setTitle(null)
  }, [scrolledPosition, viewportHeight])

  return (
    <div className={cn(s.overview, isReady && s.ready)} onMouseLeave={() => isHome && setTitle(null)} >
      <h1 className={cn(!isHome && isReady && s.active)}>{title}</h1>
      <div className={s.leftColumn}>
        {overview.leftColumn.map((block, index) =>
          <div key={index} onMouseEnter={() => setTitle(block.project.title)} >
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
      <div className={s.rightColumn}>
        {overview.rightColumn.map((block, index) =>
          <div key={index} onMouseEnter={() => setTitle(block.project.title)} >
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
      <div className={cn(s.fade, !isHome && s.active)} />
    </div>
  )
}
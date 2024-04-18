'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';
import ProjectList from './ProjectList';

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
      <ProjectList
        position='left'
        items={overview.leftColumn}
        onHover={(title) => setTitle(title)}
        active={isReady}
      />
      <ProjectList
        position='right'
        items={overview.rightColumn}
        onHover={(title) => setTitle(title)}
        active={isReady}
      />
      <div className={cn(s.fade, !isHome && s.active)} />
    </div>
  )
}
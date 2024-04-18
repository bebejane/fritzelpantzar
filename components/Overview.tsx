'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { awaitElement } from 'next-dato-utils/utils';
import ProjectList from './ProjectList';

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const router = useRouter()
  const pathname = usePathname()
  const [title, setTitle] = useState<string | null>(null)
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const isHome = usePathname() === '/';
  const isReady = (scrolledPosition && scrolledPosition >= viewportHeight) ? true : false

  useEffect(() => {
    if (scrolledPosition < (viewportHeight / 2))
      setTitle(null)
  }, [scrolledPosition, viewportHeight])

  useEffect(() => {

    if (pathname === '/') return

    const handleScroll = (e: WheelEvent) => {
      const target = e.target as HTMLDivElement
      const bottom = (target.scrollTop + target.clientHeight) > (target.scrollHeight - 100)
      if (bottom) {
        setTitle(null)
        router.back()
      }
    }

    const init = async () => {
      const modal = await awaitElement<HTMLDivElement>('#modal');
      modal?.addEventListener('scroll', handleScroll)
    }

    init()

    return () => document.getElementById('modal')?.removeEventListener('scroll', handleScroll)

  }, [pathname])

  return (
    <div className={cn(s.overview, isReady && s.ready)} onMouseLeave={() => isHome && setTitle(null)} >
      {isReady && <h1 className={cn(!isHome && isReady && s.active)}>{title}</h1>}
      <ProjectList
        position='left'
        items={overview.leftColumn}
        onHover={(title) => setTitle(title)}
        ready={isReady}
      />
      <ProjectList
        position='right'
        items={overview.rightColumn}
        onHover={(title) => setTitle(title)}
        ready={isReady}
      />
      <div className={cn(s.overlay, !isHome && s.active)} />
    </div>
  )
}
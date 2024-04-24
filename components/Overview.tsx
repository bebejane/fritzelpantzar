'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { awaitElement } from 'next-dato-utils/utils';
import ProjectList from './ProjectList';
import ProjectListLenis from './ProjectListLenis';
import { useStore } from '../lib/store';

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const router = useRouter()
  const pathname = usePathname()
  const [showAbout, setShowAbout] = useStore(state => [state.showAbout, state.setShowAbout])
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const [title, setTitle] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [opacity, setOpacity] = useState<number | null>(null)
  const [endRatio, setEndRatio] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (scrolledPosition < (viewportHeight / 2))
      setTitle(null)
  }, [scrolledPosition, viewportHeight])

  useEffect(() => {
    const ready = (scrolledPosition && scrolledPosition >= viewportHeight) && !showAbout ? true : false
    setReady(ready)
  }, [scrolledPosition, viewportHeight, showAbout])

  useEffect(() => {
    const logo = document.getElementById('logo')
    if (!logo) return

    const handleLogoClick = () => ref.current.scrollIntoView({ behavior: 'smooth' })

    logo.addEventListener('click', handleLogoClick)
    logo.style.opacity = ready ? '0' : '1'

    return () => {
      logo.style.opacity = '1'
      logo.removeEventListener('click', handleLogoClick)
    }
  }, [ready])

  useEffect(() => {

    if (pathname === '/') return setEndRatio(null)

    let modal: HTMLDivElement | null;

    const handleScroll = (e: WheelEvent) => {
      const target = e.target as HTMLDivElement
      const bottom = (target.scrollTop + target.clientHeight) > (target.scrollHeight - 100)
      const end = (target.scrollHeight - (target.scrollTop + target.clientHeight + 100)) - viewportHeight

      if (bottom) {
        setTitle(null)
        router.back()
      }
      if (end < 0)
        setEndRatio(Math.min(1, (Math.abs(end) / viewportHeight)))
    }

    (async () => {
      modal = await awaitElement<HTMLDivElement>('#modal');
      modal?.addEventListener('scroll', handleScroll)
    })()

    return () => modal?.removeEventListener('scroll', handleScroll)

  }, [pathname])

  return (
    <div
      id="overview"
      ref={ref}
      className={cn(s.overview, ready && s.ready, 'blue-cursor')}
      style={{
        filter: endRatio === null ? undefined : `grayscale(${(1 - Math.pow(endRatio || 0, 4))})`,
        opacity: endRatio === null ? undefined : endRatio
      }}
      onMouseLeave={() => isHome && setTitle(null)}
      onClick={() => showAbout && setShowAbout(false)}
    >
      {ready &&
        <h1 className={cn((!isHome && ready) && s.active)}>{title}</h1>
      }
      <ProjectList
        position='left'
        items={overview.leftColumn}
        onHover={(title) => setTitle(title)}
        ready={ready}
      />
      <ProjectList
        position='right'
        items={overview.rightColumn}
        onHover={(title) => setTitle(title)}
        ready={ready}
      />
      {!endRatio && <div className={cn(s.overlay, !isHome && s.active)} />}
    </div>
  )
}
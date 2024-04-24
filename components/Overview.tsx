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
  const [showAbout, setShowAbout, hoverAbout] = useStore(state => [state.showAbout, state.setShowAbout, state.hoverAbout])
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const [title, setTitle] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [endRatio, setEndRatio] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showAbout ? 'hidden' : 'auto'
    //@ts-ignore
    document.body.scroll = showAbout ? 'no' : 'auto'
  }, [showAbout])

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
      const end = ((target.scrollHeight - (target.scrollTop + target.clientHeight)) - viewportHeight)
      console.log(bottom, end)
      if (bottom) {
        setTitle(null)
        router.back()
      }
      if (end < 0)
        setEndRatio(Math.min(1, (Math.abs(end) / viewportHeight)))
    }

    const handleClick = (e: MouseEvent) => {
      if (e.target.id === 'modal') router.back()
    }

    (async () => {
      modal = await awaitElement<HTMLDivElement>('#modal');
      modal?.addEventListener('scroll', handleScroll)
      modal?.addEventListener('click', handleClick)
    })()

    return () => {
      modal?.removeEventListener('scroll', handleScroll)
      modal?.removeEventListener('click', handleClick)
    }

  }, [pathname])

  useEffect(() => {
    hoverAbout && setTitle('Om oss')
  }, [hoverAbout])

  return (
    <>
      {ready &&
        <h1 className={cn(s.title, (!isHome && ready) && s.active)}>{title}</h1>
      }
      <div
        id="overview"
        ref={ref}
        className={cn(s.overview, ready && s.ready)}
        style={{ opacity: endRatio === null ? undefined : endRatio }}
        onMouseLeave={() => isHome && setTitle(null)}
        onClick={() => showAbout && setShowAbout(false)}
      >

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
    </>
  )
}
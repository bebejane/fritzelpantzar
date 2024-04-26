'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { use, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { awaitElement } from 'next-dato-utils/utils';
import ProjectList from './ProjectList';
import { useStore } from '../lib/store';

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const router = useRouter()
  const pathname = usePathname()
  const [showAbout, setShowAbout, hoverAbout, inOverview, setInOverview, setInIntro, inIntro] = useStore(state => [state.showAbout, state.setShowAbout, state.hoverAbout, state.inOverview, state.setInOverview, state.setInIntro, state.inIntro])
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const [title, setTitle] = useState<string | null>(null)
  const [hideTitle, setHideTitle] = useState<boolean>(false)
  const [endRatio, setEndRatio] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isHome = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setInIntro(pathname === '/' && scrolledPosition < viewportHeight)
  }, [pathname, scrolledPosition, viewportHeight])

  useEffect(() => {
    document.body.style.overflow = showAbout ? 'hidden' : 'auto'
    //@ts-ignore
    document.body.scroll = showAbout ? 'no' : 'auto'
  }, [showAbout])

  useEffect(() => {
    if (scrolledPosition < (viewportHeight / 2))
      setTitle(null)
  }, [showAbout, scrolledPosition, viewportHeight])

  useEffect(() => {
    const ready = ((scrolledPosition && scrolledPosition >= viewportHeight) && !showAbout) ? true : false
    setInOverview(ready)
  }, [showAbout, scrolledPosition, viewportHeight, pathname])

  useEffect(() => {
    const logo = document.getElementById('logo')
    if (!logo) return

    const handleLogoClick = () => ref.current.scrollIntoView({ behavior: 'smooth' })

    logo.addEventListener('click', handleLogoClick)
    logo.style.opacity = !inIntro ? '0' : '1'

    return () => {
      logo.style.opacity = '1'
      logo.removeEventListener('click', handleLogoClick)
    }
  }, [inIntro])

  useEffect(() => {

    if (pathname === '/') return setEndRatio(null)

    let modal: HTMLDivElement | null;

    const handleScroll = (e: WheelEvent) => {
      const target = e.target as HTMLDivElement
      const bottom = (target.scrollTop + target.clientHeight) > (target.scrollHeight - 100)
      const end = ((target.scrollHeight - (target.scrollTop + target.clientHeight)) - viewportHeight)

      if (bottom) {
        setTitle(null)
        router.back()
      }
      if (end < 0)
        setEndRatio(Math.min(1, (Math.abs(end) / viewportHeight)))
    }

    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLDivElement).id === 'modal') router.back()
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

  useEffect(() => {
    showAbout ? setHideTitle(true) : setTimeout(() => setHideTitle(false), 300)
    setInOverview(!showAbout)
  }, [showAbout])

  return (
    <>
      {!hideTitle && <h1 className={cn(s.title, (!isHome && inOverview) && s.active)}>{title}</h1>}
      <div
        id="overview"
        ref={ref}
        className={cn(s.overview, inOverview && s.ready)}
        style={{ opacity: endRatio === null ? undefined : endRatio }}
        onMouseLeave={() => isHome && setTitle(null)}
        onClick={() => showAbout && setShowAbout(false)}
      >
        <ProjectList
          position='left'
          items={overview.leftColumn}
          onHover={(title) => setTitle(title)}
          ready={inOverview}
        />
        <ProjectList
          position='right'
          items={overview.rightColumn}
          onHover={(title) => setTitle(title)}
          ready={inOverview}
        />
        {!endRatio && <div className={cn(s.overlay, !isHome && s.active)} />}
      </div>
    </>
  )
}
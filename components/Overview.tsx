'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { awaitElement } from 'next-dato-utils/utils';
import ProjectList from './ProjectList';
import { useStore } from '../lib/store';
import useIsDesktop from '../lib/hooks/useIsDesktop';
import { useWindowSize } from 'react-use';

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const router = useRouter()
  const pathname = usePathname()
  const [showAbout, setShowAbout, hoverAbout, inOverview, setInOverview, setInIntro] = useStore(state => [state.showAbout, state.setShowAbout, state.hoverAbout, state.inOverview, state.setInOverview, state.setInIntro])
  const { scrolledPosition, viewportHeight, isScrolling } = useScrollInfo()
  const { width, height } = useWindowSize()
  const [project, setProject] = useState<ProjectRecord | null>(null)
  const [endRatio, setEndRatio] = useState<number | null>(null)
  const [isHome, setIsHome] = useState<boolean>(pathname === '/')
  const isDesktop = useIsDesktop()
  const ref = useRef<HTMLDivElement>(null)

  const handleHover = (project: ProjectRecord, position: 'left' | 'right' | 'center') => {
    setProject(project)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setInIntro(pathname === '/' && (scrolledPosition < height))
    setIsHome(pathname === '/')
  }, [pathname, scrolledPosition, viewportHeight, isScrolling, width, height])

  useEffect(() => {
    document.body.style.overflow = showAbout ? 'hidden' : 'auto'
    //@ts-ignore
    document.body.scroll = showAbout ? 'no' : 'auto'
  }, [showAbout])

  useEffect(() => {
    if (scrolledPosition < (viewportHeight / 2))
      setProject(null)
  }, [showAbout, scrolledPosition, viewportHeight, isScrolling, width, height])

  useEffect(() => {
    const ready = ((scrolledPosition && scrolledPosition >= viewportHeight) && !showAbout) ? true : false
    setInOverview(ready)
  }, [showAbout, scrolledPosition, viewportHeight, pathname, isScrolling, width, height])

  useEffect(() => {

    if (pathname === '/') return setEndRatio(null)

    let modal: HTMLDivElement | null;

    const handleScroll = (e: WheelEvent) => {
      const target = e.target as HTMLDivElement
      const bottom = (target.scrollTop + target.clientHeight) > (target.scrollHeight - 100)
      const end = ((target.scrollHeight - (target.scrollTop + target.clientHeight)) - viewportHeight)

      if (bottom) {
        setProject(null)
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
    setInOverview(!showAbout)
  }, [showAbout])

  return (
    <>
      <div
        id="overview"
        ref={ref}
        className={cn(s.overview, inOverview && s.ready)}
        style={{ opacity: endRatio === null ? undefined : endRatio }}
        onMouseLeave={() => isHome && setProject(null)}
        onClick={() => showAbout && setShowAbout(false)}
      >
        {isDesktop ?
          <>
            <ProjectList
              position='left'
              items={overview.leftColumn}
              onHover={handleHover}
              ready={inOverview}
              project={project}
            />
            <ProjectList
              position='right'
              items={overview.rightColumn}
              onHover={handleHover}
              ready={inOverview}
              project={project}
            />
          </>
          :
          <ProjectList
            position='center'
            items={overview.leftColumn.concat(overview.rightColumn)}
            onHover={handleHover}
            ready={inOverview}
            project={project}
          />
        }
        {!endRatio && <div className={cn(s.overlay, !isHome && s.active)} />}
      </div>
    </>
  )
}
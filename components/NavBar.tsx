'use client'

import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";
import { useEffect, useState } from 'react';
import useIsDesktop from '@lib/hooks/useIsDesktop';

export default function NavBar() {

  const [showAbout, setShowAbout, setHoverAbout, hoverAbout, inOverview] = useStore(state => [state.showAbout, state.setShowAbout, state.setHoverAbout, state.hoverAbout, state.inOverview])
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isDesktop = useIsDesktop();
  const isClose = !isHome || showAbout;
  const [invert, setInvert] = useState(true);

  const handleClick = () => {

    if (pathname === '/about')
      router.push('/')
    else if (!isHome)
      router.back();
    else
      setShowAbout(!showAbout);
  }

  useEffect(() => {
    if (pathname === '/about')
      return setInvert(true);

    if (showAbout)
      setInvert(showAbout);
    else
      setTimeout(() => setInvert(showAbout), 300);
  }, [showAbout, pathname]);

  return (
    <>
      <nav className={cn(s.navbar, (!inOverview && !showAbout) && s.inactive, isClose && s.closed)} key={pathname}>
        <img
          id="menu"
          src="/images/fp.svg"
          alt="Menu"
          onClick={handleClick}
          className={cn(s.icon, s.menu)}
          onMouseEnter={() => isDesktop && setHoverAbout(true)}
          onMouseLeave={() => isDesktop && setHoverAbout(false)}
        />
        <img
          key={`${invert}`}
          src={`/images/close${invert ? '-white' : ''}.svg`}
          alt="Close"
          className={cn(s.icon, s.close)}
          onClick={handleClick}
        />
      </nav>
      <div className={cn(s.tooltip, (hoverAbout && !showAbout) && s.show)}>
        <h2>Info & Kontakt</h2>
      </div>
    </>
  );
}


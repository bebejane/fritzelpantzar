'use client'

import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";
import { useEffect, useState } from 'react';
import path from 'path';

export default function NavBar() {

  const [showAbout, setShowAbout, setHoverAbout, hoverAbout, inIntro] = useStore(state => [state.showAbout, state.setShowAbout, state.setHoverAbout, state.hoverAbout, state.inIntro])
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isClose = !isHome || showAbout;
  const [invert, setInvert] = useState(false);

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
      <nav className={cn(s.navbar, inIntro && s.inactive, isClose && s.closed)}>
        <img
          id="menu"
          src="/images/fp.svg"
          alt="Menu"
          onClick={handleClick}
          className={s.menu}
          onMouseEnter={() => setHoverAbout(true)}
          onMouseLeave={() => setHoverAbout(false)}
        />

        <img src={`/images/close${invert ? '-white' : ''}.svg`} alt="Close" className={s.close} onClick={handleClick} />

      </nav>
      <div className={cn(s.tooltip, (hoverAbout && !showAbout) && s.show)}>
        <h2>Info & Kontakt</h2>
      </div>
    </>
  );
}


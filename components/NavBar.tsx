'use client'

import React, { useEffect, useState } from "react";
import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";
import { useScrollInfo } from "next-dato-utils/hooks";

export default function NavBar() {

  const [showAbout, setShowAbout, setHoverAbout] = useStore(state => [state.showAbout, state.setShowAbout, state.setHoverAbout])
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isClose = !isHome || showAbout;
  const [isInOverView, setInOverView] = useState(false);

  useEffect(() => {
    const isInOverView = scrolledPosition >= viewportHeight;
    setInOverView(isInOverView);
  }, [scrolledPosition, viewportHeight])

  const handleClick = () => {
    if (!isHome) {
      router.back();
    } else {
      setShowAbout(!showAbout);
    }
  }

  return (
    <nav className={cn(s.navbar, showAbout && s.invert, !isInOverView && s.inactive, 'cursor-white', isClose && s.closed)}>
      <img
        id="menu"
        src="/images/fp.svg"
        alt="Menu"
        onClick={handleClick}
        className={s.menu}
        onMouseEnter={() => setHoverAbout(true)}
        onMouseLeave={() => setHoverAbout(false)}
      />
      <img id="close" src="/images/close.svg" alt="Close" onClick={handleClick} className={s.close} />
    </nav>
  );
}


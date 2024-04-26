'use client'

import React from "react";
import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";
import { useScrollInfo } from "next-dato-utils/hooks";

export type Props = {

}

export default function NavBar({ }: Props) {

  const [showAbout, setShowAbout, setHoverAbout] = useStore(state => [state.showAbout, state.setShowAbout, state.setHoverAbout])
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isClose = !isHome || showAbout;
  const isInOverView = scrolledPosition >= viewportHeight;

  const handleClick = () => {
    if (!isHome) {
      router.back();
    } else {
      setShowAbout(!showAbout);
    }
  }

  return (
    <nav className={cn(s.navbar, showAbout && s.invert, !isInOverView && s.inactive, 'cursor-white')}>
      <img
        src="/images/fp.svg"
        alt="Logo"
        onClick={handleClick}
        className={cn(!isClose && s.show)}
        onMouseEnter={() => setHoverAbout(true)}
        onMouseLeave={() => setHoverAbout(false)}
      />
      <img src="/images/close.svg" alt="Close" onClick={handleClick} className={cn(isClose && s.show)} />
    </nav>
  );
}


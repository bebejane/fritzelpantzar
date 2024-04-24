'use client'

import React from "react";
import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";

export type Props = {

}

export default function NavBar({ }: Props) {

  const [showAbout, setShowAbout, setHoverAbout] = useStore(state => [state.showAbout, state.setShowAbout, state.setHoverAbout])
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isClose = !isHome || showAbout;

  const handleClick = () => {
    if (!isHome) {
      router.back();
    } else {
      setShowAbout(!showAbout);
    }
  }

  return (
    <nav className={cn(s.navbar, showAbout && s.invert)}>
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


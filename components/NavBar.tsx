'use client'

import React, { useEffect } from "react";
import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";
import Logo from '/images/fp.svg'
import Close from '/images/close.svg'
export type Props = {

}

export default function NavBar({ }: Props) {

  const [showAbout, setShowAbout] = useStore(state => [state.showAbout, state.setShowAbout])
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
      <img src="/images/fp.svg" alt="Logo" onClick={handleClick} className={cn(!isClose && s.show)} />
      <img src="/images/close.svg" alt="Close" onClick={handleClick} className={cn(isClose && s.show)} />
    </nav>
  );
}


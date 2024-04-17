'use client'

import React from "react";
import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from "../lib/store";

export type Props = {

}

export default function NavBar({ }: Props) {

  const [showAbout, setShowAbout] = useStore(state => [state.showAbout, state.setShowAbout])
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleClick = () => {
    if (!isHome) {
      router.back();
    } else {
      setShowAbout(!showAbout);
    }
  }

  return (
    <nav className={cn(s.navbar, !isHome && s.close, showAbout && s.invert)}>
      <img src="/images/fp.svg" alt="Logo" onClick={handleClick} />
    </nav>
  );
}


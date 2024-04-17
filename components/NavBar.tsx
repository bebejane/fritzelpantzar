'use client'

import React from "react";
import s from './NavBar.module.scss'
import cn from 'classnames'
import { useRouter, usePathname } from 'next/navigation'

export type Props = {

}

export default function NavBar({ }: Props) {

  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleClose = () => {
    if (!isHome) {
      router.back();
    }
  }

  return (
    <nav className={cn(s.navbar, !isHome && s.close)}>
      <img src="/images/fp.svg" alt="Logo" onClick={handleClose} />
    </nav>
  );
}


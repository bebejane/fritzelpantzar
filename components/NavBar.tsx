'use client'

import React from "react";
import s from './NavBar.module.scss'
import { useRouter, usePathname } from 'next/navigation'

export type Props = {

}

export default function NavBar({ }: Props) {

  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    if (pathname !== '/') {
      router.back();
    }
  }

  return (
    <nav className={s.navbar}>
      <img src="/images/fp.svg" alt="Logo" onClick={handleClose} />
    </nav>
  );
}


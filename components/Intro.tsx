'use client'

import Link from "next/link";
import s from './Intro.module.scss'
import cn from 'classnames'

export default function Intro() {

  return (
    <div className={s.intro}>
      <img id="logo" src="/images/logo-nodot.svg" alt="Logo" />
      <img id="logoF" className={s.f} src="/images/logo_f.svg" alt="Logo" />
    </div>
  );
}
'use client'

import Link from "next/link";
import s from './Intro.module.scss'
import cn from 'classnames'
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import { useScrollInfo } from "next-dato-utils/hooks";

export default function Intro() {
  const ref = useRef<HTMLImageElement>(null)
  const f = useRef<HTMLImageElement>(null)
  const p = useRef<HTMLImageElement>(null)
  const { width, height } = useWindowSize()
  const { scrolledPosition, viewportHeight } = useScrollInfo()


  useEffect(() => {
    const logo = ref.current
    const logoF = f.current
    const logoP = p.current

    if (!logo || !logoF || !logoP) return

    const ratio = Math.min(scrolledPosition / viewportHeight, 1)
    const margin = 20;
    const topEnd = margin;
    const bounds = logo.getBoundingClientRect()

    const logoFLeftPerc = 1.057
    const logoFLeftEnd = width - logoF.getBoundingClientRect().width - logoP.getBoundingClientRect().width - margin;
    const logoFTopEnd = margin
    const logoFTop = (bounds.top * (1 - ratio)) + (logoFTopEnd * ratio)
    const logoFLeft = ((logoFLeftEnd - ((bounds.left * logoFLeftPerc))) * ratio) + (bounds.left * logoFLeftPerc)

    const logoPLeftPerc = 1.99
    const logoPLeftEnd = width - logoP.getBoundingClientRect().width - margin;
    const logoPTopEnd = margin
    const logoPTop = (bounds.top * (1 - ratio)) + (logoPTopEnd * ratio)
    const logoPLeft = ((logoPLeftEnd - ((bounds.left * logoPLeftPerc))) * ratio) + (bounds.left * logoPLeftPerc)

    logoF.style.top = `${logoFTop}px`
    logoF.style.left = `${logoFLeft}px`
    logoP.style.top = `${logoPTop}px`
    logoP.style.left = `${logoPLeft}px`

  }, [scrolledPosition, viewportHeight, width, height])


  return (
    <div className={s.intro}>
      <img id="logo" className={s.logo} src="/images/logo-stripped.svg" alt="Logo" ref={ref} />
      <img id="logo-f" className={s.f} src="/images/logo-f.svg" ref={f} />
      <img id="logo-p" className={s.p} src="/images/logo-p.svg" ref={p} />
    </div>
  );
}
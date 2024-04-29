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
    const space = '2vw';
    const logoFLeftPerc = 1.057
    const logoPLeftPerc = 1.99

    const bounds = logo.getBoundingClientRect()

    const logoFLeftEnd = width - logoF.getBoundingClientRect().width - logoP.getBoundingClientRect().width;
    const logoFTop = (bounds.top * (1 - ratio))
    const logoFLeft = ((logoFLeftEnd - ((bounds.left * logoFLeftPerc))) * ratio) + (bounds.left * logoFLeftPerc)
    const logoPLeftEnd = width - logoP.getBoundingClientRect().width;
    const logoPTop = (bounds.top * (1 - ratio))
    const logoPLeft = ((logoPLeftEnd - ((bounds.left * logoPLeftPerc))) * ratio) + (bounds.left * logoPLeftPerc)

    logoF.style.top = `calc(${logoFTop}px + calc(${ratio} * var(--outer-margin)))`
    logoF.style.left = `calc(${logoFLeft}px - calc(${ratio} * ${space}) - calc(${ratio} * var(--outer-margin)))`
    logoF.style.transform = `rotate(${ratio * 360}deg)`

    logoP.style.top = `calc(${logoPTop}px + calc(${ratio} * var(--outer-margin)))`
    logoP.style.left = `calc(${logoPLeft}px - calc(calc(${ratio} * var(--outer-margin)))`

    logoP.style.transform = `rotate(${ratio * 360}deg)`

  }, [scrolledPosition, viewportHeight, width, height])


  return (
    <div className={s.intro}>
      <img id="logo" className={s.logo} src="/images/logo-stripped.svg" alt="Logo" ref={ref} />
      <img id="logo-f" className={s.f} src="/images/logo-f.svg" ref={f} />
      <img id="logo-p" className={s.p} src="/images/logo-p.svg" ref={p} />
    </div>
  );
}
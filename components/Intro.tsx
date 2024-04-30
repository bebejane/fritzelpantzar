'use client'

import s from './Intro.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { useScrollInfo } from "next-dato-utils/hooks";
import { useStore } from '../lib/store';
import { usePathname } from 'next/navigation';

const symbolSpace = '2vw';
const logoFLeftPerc = 1.062
const logoPLeftPerc = 1.995

export default function Intro() {

  const ref = useRef<HTMLImageElement>(null)
  const f = useRef<HTMLImageElement>(null)
  const p = useRef<HTMLImageElement>(null)

  const pathname = usePathname()
  const [inIntro] = useStore((state) => [state.inIntro])
  const [logoFStyle, setLogoFStyle] = useState<any | null>(null)
  const [logoPStyle, setLogoPStyle] = useState<any | null>(null)
  const { width, height } = useWindowSize()
  const { scrolledPosition, viewportHeight } = useScrollInfo()

  const updateStyles = async () => {

    const logo = ref.current
    const logoF = f.current
    const logoP = p.current

    if (!logo || !logoF || !logoP) return console.error('Logo not found')

    const ratio = Math.min(scrolledPosition / viewportHeight, 1)
    const bounds = logo.getBoundingClientRect()

    const logoFLeftEnd = width - logoF.getBoundingClientRect().width - logoP.getBoundingClientRect().width;
    const logoFTop = (bounds.top * (1 - ratio))
    const logoFLeft = ((logoFLeftEnd - ((bounds.left * logoFLeftPerc))) * ratio) + (bounds.left * logoFLeftPerc)

    const logoPLeftEnd = width - logoP.getBoundingClientRect().width;
    const logoPTop = (bounds.top * (1 - ratio))
    const logoPLeft = ((logoPLeftEnd - ((bounds.left * logoPLeftPerc))) * ratio) + (bounds.left * logoPLeftPerc)
    const baseStyle = { transform: `rotate(${ratio * 360}deg)`, opacity: !inIntro ? 0 : 1 }

    setLogoFStyle({
      ...baseStyle,
      top: `calc(${logoFTop}px + calc(${ratio} * var(--nav-margin-top)))`,
      left: `calc(${logoFLeft}px - calc(${ratio} * ${symbolSpace}) - calc(${ratio} * var(--nav-margin)))`,
    })

    setLogoPStyle({
      ...baseStyle,
      top: `calc(${logoPTop}px + calc(${ratio} * var(--nav-margin-top)))`,
      left: `calc(${logoPLeft}px - calc(calc(${ratio} * var(--nav-margin)))`,
    })

    logo.style.opacity = !inIntro ? '0' : '1'
  }

  useEffect(() => {
    updateStyles()
  }, [scrolledPosition, viewportHeight, width, height, inIntro, pathname])

  const handleClick = () => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <div className={s.intro} onClick={handleClick}>
        <img id="logo" className={cn(s.logo, !logoFStyle && s.hidden)} src="/images/logo-stripped.svg" alt="Logo" ref={ref} />
      </div>
      <img id="logo-f" className={s.f} style={logoFStyle} src="/images/logo-f.svg" ref={f} />
      <img id="logo-p" className={s.p} style={logoPStyle} src="/images/logo-p.svg" ref={p} />
    </>
  );
}
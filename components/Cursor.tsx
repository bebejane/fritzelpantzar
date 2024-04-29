'use client'
import cn from 'classnames'
import s from './Cursor.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useWindowSize } from 'react-use'
import { useStore } from '../lib/store'
import { usePathname } from 'next/navigation'

const leftDotPercentage = 0.14;
const cursorSizeDivider = 45
const transitionTime = 0.4

type CursorStyle = {
  top?: number,
  left?: number,
  width?: number,
  height?: number,
  transitionTime?: string,
}

const defaultCursorStyle: CursorStyle = {
  top: -16,
  left: -16,
  width: 16,
  height: 16,
  transitionTime: `${transitionTime}s`
}

export default function Footer() {


  const { width, height } = useWindowSize();
  const [style, setStyle] = useState<CursorStyle>(defaultCursorStyle);
  const [init, setInit] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [showAbout, inIntro] = useStore(state => [state.showAbout, state.inIntro])
  const [cursorColor, setCursorColor] = useState<'white' | 'blue'>('white')
  const pathname = usePathname()
  const ref = useRef<HTMLImageElement>(null);

  const initStyle = () => {
    console.log('initStyle')
    setInit(false)
    setReady(false)

    const logo = document.getElementById('logo');
    const bounds = logo?.getBoundingClientRect();

    if (!logo) {
      setInit(true)
      setReady(true)
      setHidden(false)
      console.log('initStyle', 'no logo')
      return
    }

    setStyle((s) => ({
      ...s,
      top: bounds.top,
      left: bounds.left + (bounds.width * leftDotPercentage),
    }));

    setTimeout(() => setInit(true), 100);

    console.log('initStyle', 'done')
  }

  useEffect(() => {

    if (!init)
      initStyle()

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    const handleMouse = (e: MouseEvent) => {
      setStyle((s) => ({
        ...s,
        top: e.clientY - (s.height / 2),
        left: e.clientX - (s.width / 2)
      }));
      setHidden(false)

      if (init && !ready)
        return setTimeout(() => setReady(true), transitionTime * 1000);
    }

    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    }
  }, [init, ready])


  useEffect(() => {
    const logo = document.getElementById('logo') as HTMLImageElement;
    const bounds = logo?.getBoundingClientRect();
    const size = bounds ? bounds.width / cursorSizeDivider : 16;

    setStyle((s) => ({
      ...s,
      width: size,
      height: size,
    }));

  }, [width, height])

  useEffect(() => {
    setCursorColor(showAbout || inIntro || pathname === '/about' ? 'white' : 'blue')
  }, [pathname, showAbout, inIntro])

  return (
    <img
      ref={ref}
      className={cn(s.cursor, init && s.init, ready && s.ready, hidden && s.hidden)}
      src={`/images/cursor-${cursorColor}.svg`}
      style={style}
    />
  );
}
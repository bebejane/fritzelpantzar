'use client'
import cn from 'classnames'
import s from './Cursor.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useWindowSize } from 'react-use'

const leftDotPercentage = 0.14;
const cursorSizeDivider = 45

export default function Footer() {

  const { width, height } = useWindowSize();
  const [style, setStyle] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
  const [init, setInit] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const ref = useRef<HTMLImageElement>(null);

  const initStyle = () => {
    const logo = document.getElementById('logo');
    const bounds = logo?.getBoundingClientRect();

    setInit(false)
    setReady(false)

    setStyle((s) => ({
      ...s,
      top: bounds.top,
      left: bounds.left + (bounds.width * leftDotPercentage),
    }));
  }
  const handleMouse = (e: MouseEvent) => {
    setStyle((s) => ({ ...s, top: e.clientY, left: e.clientX, }));
    if (!ready) setTimeout(() => setReady(true), 1000)
  }

  const handleMouseLeave = () => setHidden(true);
  const handleMouseEnter = () => setHidden(false);

  useEffect(() => {

    initStyle();

    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    }
  }, [])

  useEffect(() => {
    const logo = document.getElementById('logo') as HTMLImageElement;
    const bounds = logo?.getBoundingClientRect();
    const size = bounds.width / cursorSizeDivider;

    setStyle((s) => ({
      ...s,
      width: size,
      height: size,
    }));

  }, [width, height])

  useEffect(() => {
    setInit(!style ? false : style.width > 0 && style.height > 0 && style.top > 0 && style.left > 0);
  }, [style])

  return (
    <img
      ref={ref}
      className={cn(s.cursor, init && s.init, ready && s.ready, hidden && s.hidden)}
      src="/images/cursor-white.svg"
      style={style}
    />
  );
}
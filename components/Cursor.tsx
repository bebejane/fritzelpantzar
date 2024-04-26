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
  const [ready, setReady] = useState<boolean>(false);
  const ref = useRef<HTMLImageElement>(null);

  const handleMouse = (e: MouseEvent) => {
    setStyle((s) => ({ ...s, top: e.clientY, left: e.clientX, }));
    if (!ready) setTimeout(() => setReady(true), 1000)
  }

  useEffect(() => {

    const logo = document.getElementById('logo');
    const bounds = logo?.getBoundingClientRect();

    setStyle((s) => ({
      ...s,
      top: bounds.top,
      left: bounds.left + (bounds.width * leftDotPercentage),
    }));

    document.addEventListener('mousemove', handleMouse);
    return () => {
      document.removeEventListener('mousemove', handleMouse);
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
      className={cn(s.cursor, init && s.init, ready && s.ready)}
      src="/images/cursor-white.svg"
      style={style}
    />
  );
}
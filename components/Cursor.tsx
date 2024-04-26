'use client'
import cn from 'classnames'
import s from './Cursor.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useWindowSize } from 'react-use'
import { useStore } from '../lib/store'

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

export default function Footer() {

  const [inOverview] = useStore((state) => [state.ready])
  const { width, height } = useWindowSize();
  const [style, setStyle] = useState<CursorStyle | null>(null);
  const [init, setInit] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const ref = useRef<HTMLImageElement>(null);

  const initStyle = () => {

    setInit(false)
    setReady(false)

    const logo = document.getElementById('logo');
    const bounds = logo?.getBoundingClientRect();

    if (!bounds) {
      setReady(true)
      setInit(true)
      return
    }

    setStyle((s) => ({
      ...s,
      top: bounds.top,
      left: bounds.left + (bounds.width * leftDotPercentage),
      transitionTime: `${transitionTime}s`,
    }));

  }

  const handleMouse = (e: MouseEvent) => {
    setStyle((s) => ({ ...s, top: e.clientY, left: e.clientX, }));
    if (init)
      setTimeout(() => setReady(true), transitionTime * 1000);
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
  }, [init])

  useEffect(() => {
    const init = !style ? false : style.width > 0 && style.height > 0 && style.top > 0 && style.left > 0;
    setInit(init);

  }, [style])

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

  return (
    <img
      ref={ref}
      className={cn(s.cursor, init && s.init, ready && s.ready, hidden && s.hidden)}
      src={`/images/cursor-${inOverview ? 'blue' : 'white'}.svg`}
      style={style}
    //onTransitionEnd={() => setReady(true)}
    />
  );
}
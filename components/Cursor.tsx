'use client'

import { useRaf } from 'react-use';
import s from './Cursor.module.scss'
import { useState, useEffect, useRef } from 'react'

export default function Footer() {
  return null
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null)
  const refEvents = useRef<HTMLDivElement>(null)

  const handleMouse = (e: React.MouseEvent) => {
    setPosition({ top: e.clientY, left: e.clientX });
    const eventCopy = new MouseEvent(e.type, e.nativeEvent);
    const el = document.elementsFromPoint(e.clientX, e.clientY)[1]
    el.dispatchEvent(eventCopy);

  }

  return (
    <>
      <div id="cursor-events" className={s.events} ref={refEvents} />
      <div
        ref={ref}
        className={s.cursor}
        onMouseMove={handleMouse}
        onMouseDown={handleMouse}
        onMouseUp={handleMouse}
        onWheel={handleMouse}
        onClick={handleMouse}
      >
        <img src="/images/cursor-white.svg" alt="cursor" style={position} />
      </div>
    </>
  );
}
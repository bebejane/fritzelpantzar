'use client'

import s from './ProjectListLenis.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import { use, useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'

type LenisRef = {
  wrapper?: HTMLElement;
  content?: HTMLElement;
  lenis?: Lenis;
};

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  position: 'left' | 'right'
  onHover: (title: string) => void
  ready: boolean
}

export default function ProjectListLenis({ items, position, onHover, ready = false }: Props) {

  const lenisRef = useRef<LenisRef | null>(null)

  useEffect(() => {

    lenisRef.current.lenis?.on('scroll', (e) => {
      //console.log(e)
    })

  }, [ready])

  return (
    <ReactLenis
      className={cn(s.projects, ready && s.ready)}
      //autoRaf={false}
      ref={lenisRef}
      options={{
        orientation: 'vertical',
        infinite: true,
        gestureOrientation: 'vertical',

      }}
    >
      {items.map((block, index) =>
        <div
          id={`${position}.${index - items.length}`}
          className={s.project}
          key={index}
          onMouseEnter={() => onHover(block.project.title)}
        >
          <Block data={block} components={Blocks} />
        </div>
      )}
      <div id={`clone-${position}`} className={s.clone}>
        {items.map((block, index) =>
          <div
            id={`${position}.${index - items.length}-clone`}
            className={s.project}
            key={index}
          >
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
    </ReactLenis>
  )
}
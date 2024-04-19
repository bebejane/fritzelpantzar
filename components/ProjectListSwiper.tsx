'use client'

import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import s from './ProjectListSwiper.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import { useEffect, useRef, useState } from 'react';

export type Props = {
  items: OverviewQuery['overview']['leftColumn'] | OverviewQuery['overview']['rightColumn'];
  position: 'left' | 'right'
  onHover: (title: string) => void
  ready: boolean
}

export default function ProjectListSwiper({ items, position, onHover, ready = false }: Props) {

  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <Swiper
      className={cn(s.projects, ready && s.ready)}
      spaceBetween={0}
      loopedSlides={items.length}
      slidesPerView='auto'
      //freeMode={true}
      loop={true}
      //initialSlide={0}
      direction="vertical"
      onSwiper={(swiper) => swiperRef.current = swiper}
    >
      {items.map((block, index) =>
        <SwiperSlide className={s.slide} key={index} onMouseEnter={() => onHover(block.project.title)}>
          <Block data={block} components={Blocks} />
        </SwiperSlide>
      )}
    </Swiper>
  )
}
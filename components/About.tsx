'use client'

import s from './About.module.scss'
import cn from 'classnames'
import { Markdown } from 'next-dato-utils/components';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { Image } from 'react-datocms/image';
import Content from './Content';

export type Props = {
  data: AboutQuery['about'];
  modal: boolean;
}

export default function About({ data: { image, address, content }, modal }: Props) {

  const [showAbout, setShowAbout] = useStore(state => [state.showAbout, state.setShowAbout])

  useEffect(() => {
    if (modal)
      document.querySelector('main').classList.toggle('slided', showAbout)
  }, [modal, showAbout])

  return (
    <div className={cn(s.about, modal && s.modal, showAbout && s.open)}>
      <div className={s.content}>
        <img className={s.logo} src="/images/logo.svg" alt="Logo" />
        <div className={s.address}>{address}</div>
        {image?.responsiveImage &&
          <figure><Image data={image.responsiveImage} /></figure>
        }
        <Content className={cn("big", s.text)} content={content} />
      </div>
    </div>
  )
}
'use client'

import s from './About.module.scss'
import cn from 'classnames'
import { Markdown } from 'next-dato-utils/components';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { Image } from 'react-datocms/image';

export type Props = {
  data: AboutQuery['about'];
  modal: boolean;
}

export default function About({ data: { text, image, address, staff }, modal }: Props) {

  const [showAbout] = useStore(state => [state.showAbout])

  useEffect(() => {
    if (modal)
      document.querySelector('main').classList.toggle('slided', showAbout)
  }, [modal, showAbout])

  return (
    <div className={cn(s.about, modal && s.modal, showAbout && s.open)} >
      <div className={s.content}>
        <img className={s.logo} src="/images/logo.svg" alt="Logo" />
        {address}
        {image?.responsiveImage &&
          <Image data={image.responsiveImage} />
        }
        <Markdown className={s.text} content={text} />
        <h3>Personal</h3>
        <ul className={s.staff}>
          {staff.map((staff, i) =>
            <li key={i}>
              <Image data={staff.image?.responsiveImage} />
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
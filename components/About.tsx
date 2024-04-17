'use client'

import s from './About.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks'; import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '../lib/store';

export type Props = {

}

export default function About({ }: Props) {

  const [showAbout, setShowAbout] = useStore(state => [state.showAbout, state.setShowAbout],)
  const pathname = usePathname();
  const [title, setTitle] = useState<string | null>(null)

  return (
    <div className={cn(s.about, showAbout && s.open)} >
      <div className={s.content}>
        <img className={s.logo} src="/images/logo.svg" alt="Logo" />
        <p>Fritzell & Pantzar Arkitektur AB, Munkbrogatan 2, 111 27 Stockholm</p>
      </div>
    </div>
  )
}
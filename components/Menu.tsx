'use client'

import s from './Menu.module.scss';
import cn from 'classnames';
import { useStore } from '@lib/store';
import { useEffect, useRef, useState } from 'react';
import useIsDesktop from '@lib/hooks/useIsDesktop';

export type Props = {
  //allProjects: StartQuery['allProjects']
}

export default function Menu({ }: Props) {


  return (
    <nav>
      Menu
    </nav >
  )
}
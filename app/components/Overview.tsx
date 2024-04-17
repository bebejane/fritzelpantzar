'use client'

import s from './Overview.module.scss'
import cn from 'classnames'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks'; import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const pathname = usePathname();
  const [title, setTitle] = useState<string | null>(null)


  return (
    <div className={s.overview} >
      <h1 className={cn(pathname !== '/' && s.active)}>{title}</h1>
      <div className={s.leftColumn}>
        {overview.leftColumn.map((block, index) =>
          <div key={index} onMouseEnter={() => setTitle(block.project.title)} >
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
      <div className={s.rightColumn}>
        {overview.rightColumn.map((block, index) =>
          <div key={index} onMouseEnter={() => setTitle(block.project.title)} >
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import s from './Overview.module.scss'
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks'; import { useState } from 'react';
;

export type Props = {
  overview: OverviewQuery['overview'];
}

export default function Overview({ overview }: Props) {

  const [title, setTitle] = useState<string | null>(null)

  return (
    <div className={s.overview}>
      <h3>{title}</h3>
      <div className={s.leftColumn}>
        {overview.leftColumn.map((block, index) =>
          <div key={index} onMouseEnter={() => setTitle(block.project.title)} onMouseLeave={() => setTitle(null)}>
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
      <div className={s.rightColumn}>
        {overview.rightColumn.map((block, index) =>
          <div key={index} onMouseEnter={() => setTitle(block.project.title)} onMouseLeave={() => setTitle(null)}>
            <Block data={block} components={Blocks} />
          </div>
        )}
      </div>
    </div>
  )
}
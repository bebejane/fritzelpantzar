
import s from './page.module.scss'
import { apiQuery } from 'next-dato-utils/api';
import { Block } from 'next-dato-utils/components';
import { DraftMode } from 'next-dato-utils/components';
import { OverviewDocument } from '../graphql';
import * as Blocks from '@components/blocks';;

export default async function Start() {

  const { overview, draftUrl } = await apiQuery<OverviewQuery, OverviewQueryVariables>(OverviewDocument, {
    tags: ['project', 'overview']
  });

  return (
    <>
      <article className={s.article}>
        <div className={s.logo}>
          <img src="/images/logo.svg" alt="Logo" />
        </div>
        <div className={s.leftColumn}>
          {overview.leftColumn.map((block, index) =>
            <Block key={index} data={block} components={Blocks} />
          )}
        </div>
        <div className={s.rightColumn}>
          {overview.rightColumn.map((block, index) =>
            <Block key={index} data={block} components={Blocks} />
          )}
        </div>
      </article>
      <DraftMode url={draftUrl} tag={['project', 'overview']} />
    </>
  )
}
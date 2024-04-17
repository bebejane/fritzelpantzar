
import s from './page.module.scss'
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { OverviewDocument } from '../graphql';
import Overview from './components/Overview';

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
        <Overview overview={overview} />
      </article>
      <DraftMode url={draftUrl} tag={['project', 'overview']} />
    </>
  )
}
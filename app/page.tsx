import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { OverviewDocument } from '../graphql';
import Overview from '@components/Overview';
import Intro from '@components/Intro';

export default async function Start() {
	const { overview, draftUrl } = await apiQuery(OverviewDocument);

	return (
		<>
			<article className={s.article}>
				<Intro />
				<Overview overview={overview} />
			</article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}

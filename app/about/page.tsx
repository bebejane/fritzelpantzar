import s from './page.module.scss';
import cn from 'classnames';
import { AboutDocument } from '@graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import About from '@components/About';

export default async function AboutPage() {
	const { about, draftUrl } = await apiQuery(AboutDocument);

	if (!about) return notFound();

	return (
		<>
			<article className={s.about}>
				<About data={about} modal={false} />
			</article>
			<DraftMode url={draftUrl} tag={about.id} />
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'About',
	} as Metadata;
}

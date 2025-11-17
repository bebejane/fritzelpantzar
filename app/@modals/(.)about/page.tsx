import { AboutDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import About from '@/components/About';

export default async function AboutModal(props: PageProps<'/about'>) {
	const { about } = await apiQuery(AboutDocument);
	if (!about) return notFound();
	return <About data={about} modal={true} />;
}

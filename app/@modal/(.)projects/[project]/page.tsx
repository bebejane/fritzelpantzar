import { default as page } from '@/app/projects/[project]/page';

export default async function Page(props: PageProps<'/projects/[project]'>) {
	console.log('modallll');
	return page(props);
}

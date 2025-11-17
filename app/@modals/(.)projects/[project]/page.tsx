import s from './page.module.scss';
import cn from 'classnames';
import ProjectPage from '@/app/projects/[project]/page';

export const dynamic = 'force-static';

export default async function Page({ params, searchParams }: PageProps<'/projects/[project]'>) {
	return (
		<>
			<div id='modal' className={cn(s.modal, s.show)}>
				<ProjectPage params={params} searchParams={searchParams} modal={true} />
			</div>
			<div className={s.padding} />
		</>
	);
}

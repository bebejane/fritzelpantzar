import s from './page.module.scss';
import cn from 'classnames';
import ProjectPage from '@/app/projects/[project]/page';

export const dynamic = 'force-static';

export default async function Page({ params }: PageProps<'/projects/[project]'>) {
	return (
		<>
			<div id='modal' className={cn(s.modal, s.show)}>
				<ProjectPage params={params} modal={true} />
			</div>
			<div className={s.padding} />
		</>
	);
}

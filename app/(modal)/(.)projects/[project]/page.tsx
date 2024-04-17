import s from './page.module.scss';
import ProjectPage from '@app/projects/[project]/page';
import { Suspense } from 'react';

export default function Page({ params }: { params: { project: string } }) {

  return (
    <div className={s.modal}>
      <Suspense fallback={<div className={s.loading}></div>}>
        <ProjectPage params={params} modal={true} />
      </Suspense>
    </div>
  )
}

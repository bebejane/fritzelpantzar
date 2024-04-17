import s from './page.module.scss';
import ProjectPage from '@app/projects/[project]/page';
import { Suspense } from 'react';

export default function Page({ params }: { params: { project: string } }) {

  return (
    <div className={s.modal}>

      <ProjectPage params={params} modal={true} />

    </div>
  )
}

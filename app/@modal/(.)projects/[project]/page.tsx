import s from './page.module.scss';
import cn from 'classnames'
import ProjectPage from '../../../projects/[project]/page';
import { Suspense } from 'react';

export default async function Page({ params }: { params: { project: string } }) {

  return (
    <div className={cn(s.modal, s.show)} key={params?.project}>
      <Suspense fallback={<div className={s.loading}></div>}>
        <ProjectPage params={params} modal={true} />
      </Suspense>
    </div>
  )
}

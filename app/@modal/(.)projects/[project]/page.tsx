import s from './page.module.scss';
import cn from 'classnames'
import ProjectPage from '../../../projects/[project]/page';
import { Suspense } from 'react';

export default async function Page({ params }: { params: { project: string } }) {

  return (
    <Suspense fallback={<div className={s.loading}></div>}>
      <div className={cn(s.modal, s.show)} key={params?.project}>
        <ProjectPage params={params} modal={true} />
      </div>
      <div className={s.padding} />
    </Suspense>
  )
}

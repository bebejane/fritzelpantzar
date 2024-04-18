import s from './page.module.scss';
import cn from 'classnames'
import ProjectPage from '@app/projects/[project]/page';
import { Suspense } from 'react';

export default function Page({ params }: { params: { project: string } }) {

  return (
    <>
      <div id="modal" className={cn(s.modal, s.show)} key={params?.project}>
        <Suspense fallback={<div className={s.loading}></div>}>
          <ProjectPage params={params} modal={true} />
        </Suspense>
      </div>
      <div className={s.padding} />
    </>
  )
}

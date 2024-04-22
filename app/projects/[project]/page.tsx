'use server'

import s from './page.module.scss';
import cn from 'classnames';
import { AllProjectsDocument, ProjectDocument } from "@graphql";
import { apiQuery, } from "next-dato-utils/api";
import { DraftMode } from "next-dato-utils/components";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from "next";
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';

export type Props = {
  params: { project: string },
  modal: boolean
}

export default async function Page(props: Props) {

  const { project, draftUrl } = await apiQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, {
    variables: { slug: props.params.project },
  })

  if (!project) return notFound()

  return (
    <>
      <article className={cn(s.project, props.modal && s.modal)}>
        {!props.modal && <h1>{project.title}</h1>}
        {project.gallery.map((block, index) =>
          <Block key={index} data={block} components={Blocks} />
        )}
        <section className={s.text}>Här kommer det text om projekten</section>
      </article>
      <DraftMode url={draftUrl} tag={project.id} />
    </>
  );
}

export async function generateStaticParams() {
  const { allProjects } = await apiQuery<AllProjectsQuery, AllProjectsQueryVariables>(AllProjectsDocument, {
    all: true,
    tags: ['project']
  });
  return allProjects.map(({ slug: project }) => ({ project }))
}

export async function generateMetadata({ params }) {
  const { project } = await apiQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, {
    variables: { slug: params.project }
  })

  if (!project) return notFound()

  return {
    title: project.title,
  } as Metadata
}

'use server'

import s from './page.module.scss';
import cn from 'classnames';
import { AllProjectsDocument, ProjectDocument } from "@graphql";
import { apiQuery, } from "next-dato-utils/api";
import { DraftMode } from "next-dato-utils/components";
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@components/blocks';
import Content from '@components/Content';

export type Props = {
  params: { project: string },
  modal: boolean
}

export default async function Page(props: Props) {

  const { project, draftUrl } = await apiQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, {
    variables: { slug: props.params.project },
  })

  if (!project) return notFound()

  const { id, title, description, gallery, commisioner, year, size, projectStatus, program } = project

  return (
    <>
      <article className={cn(s.project, props.modal && s.modal)}>
        {!props.modal && <h1>{title}</h1>}
        {gallery.map((block, index) =>
          <Block key={index} data={block} components={Blocks} />
        )}
        <section className={cn(s.text, "big")}>
          <table className={s.meta}>
            <tbody>
              <tr>
                {commisioner && <><td><h4>Uppdragsgivare:</h4> {commisioner}</td></>}
                {year && <><td><h4>År:</h4> {year}</td></>}
                {size && <><td><h4>Storlek:</h4> {size}</td></>}
                {projectStatus && <><td><h4>Status:</h4> {projectStatus}</td></>}
                {program && <><td><h4>Typ:</h4> {program}</td></>}
              </tr>
            </tbody>
          </table>
          <div className={s.desc}><Content content={description} />
          </div>
        </section>
      </article >
      <DraftMode url={draftUrl} tag={id} />
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

'use server'

import { AllProjectsDocument, ProjectDocument } from "@graphql";
import { apiQuery, } from "next-dato-utils/api";
import { DraftMode } from "next-dato-utils/components";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from "next";

export default async function Page({ params }: { params: { project: string } }) {

  const { project, draftUrl } = await apiQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, {
    variables: { slug: params.project },
  })

  if (!project) return notFound()

  return (
    <>
      {project.title}

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

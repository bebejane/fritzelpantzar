import s from './page.module.scss';
import cn from 'classnames';
import { AllProjectsDocument, ProjectDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Block } from 'next-dato-utils/components';
import * as Blocks from '@/components/blocks';
import Content from '@/components/Content';
import React from 'react';

interface Props extends PageProps<'/projects/[project]'> {
	modal: boolean;
}

export default async function Page(props: Props) {
	const slug = (await props.params).project;
	const { project, draftUrl } = await apiQuery(ProjectDocument, {
		variables: { slug },
	});

	if (!project) return notFound();

	const { id, title, summary, description, gallery, commisioner, year, size, projectStatus, program, credits } =
		project;

	return (
		<>
			<article className={cn(s.project, props.modal && s.modal)}>
				<h1>{title}</h1>
				{gallery.map((block, index) => (
					<React.Fragment key={index}>
						<Block data={block} components={Blocks} />
						{index === 0 && (
							<section className={cn(s.text)}>
								<div className={s.left}>
									<p className='intro'>{summary}</p>
								</div>
								<div className={s.right}>
									<div className={cn(s.desc, 'big')}>
										<Content content={description} />
									</div>
								</div>
							</section>
						)}
					</React.Fragment>
				))}
				<table className={s.meta}>
					<tbody>
						<tr>
							<td>
								<h4>Projekt</h4>
							</td>
							<td> {title}</td>
						</tr>
						{program && (
							<>
								<tr>
									<td>
										<h4>Typ</h4>
									</td>
									<td> {program}</td>
								</tr>
							</>
						)}
						{projectStatus && (
							<>
								<tr>
									<td>
										<h4>Status</h4>
									</td>
									<td> {projectStatus}</td>
								</tr>
							</>
						)}
						{size && (
							<>
								<tr>
									<td>
										<h4>Storlek</h4>
									</td>
									<td> {size}</td>
								</tr>
							</>
						)}
						{year && (
							<>
								<tr>
									<td>
										<h4>År</h4>
									</td>
									<td> {year}</td>
								</tr>
							</>
						)}
						{commisioner && (
							<>
								<tr>
									<td>
										<h4>Kund</h4>
									</td>
									<td> {commisioner}</td>
								</tr>
							</>
						)}
						{credits && (
							<>
								<tr>
									<td>
										<h4>Samarbete</h4>
									</td>
									<td> {credits}</td>
								</tr>
							</>
						)}
					</tbody>
				</table>
			</article>
			<DraftMode url={draftUrl} tag={id} />
		</>
	);
}

export async function generateStaticParams() {
	const { allProjects } = await apiQuery(AllProjectsDocument, { all: true });
	return allProjects.map(({ slug: project }) => ({ project }));
}

export async function generateMetadata({ params }: PageProps<'/projects/[project]'>): Promise<Metadata> {
	const slug = (await params).project;
	const { project } = await apiQuery(ProjectDocument, {
		variables: { slug },
	});

	if (!project) return notFound();

	return {
		title: project.title,
	} as Metadata;
}

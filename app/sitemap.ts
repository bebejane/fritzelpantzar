import { MetadataRoute } from 'next'
import { apiQuery } from 'next-dato-utils/api';
import { AllProjectsDocument } from '../graphql';

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { allProjects } = await apiQuery<AllProjectsQuery, AllProjectsQueryVariables>(AllProjectsDocument, {
    all: true,
    tags: ['project', 'about']
  });

  return staticRoutes.concat(allProjects.map(({ slug }) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })))
}
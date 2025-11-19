import { apiQuery } from 'next-dato-utils/api';
import { AllProjectsDocument } from '@/graphql';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	routes: {
		overview: async () => ['/'],
		project: async ({ slug }) => [`/projects/${slug}`],
		person: async () => ['/about', '/'],
		about: async () => ['/about', '/'],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		const { allProjects } = await apiQuery(AllProjectsDocument, { all: true });
		return [
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
			},
		].concat(
			allProjects.map((p) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${p.slug}`,
				lastModified: new Date(p._updatedAt),
				changeFrequency: 'monthly',
				priority: 0.8,
			}))
		) as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'Fritzel Pantzar',
			short_name: 'Fritzel Pantzar',
			description: 'Fritzel Pantzar website',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#0026ff',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
} satisfies DatoCmsConfig;

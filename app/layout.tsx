import '@/styles/index.scss';
import { apiQuery } from 'next-dato-utils/api';
import { GlobalDocument } from '@/graphql';
import { Metadata } from 'next/types';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import NavBar from '@/components/NavBar';
import Cursor from '@/components/Cursor';
import localFont from 'next/font/local';

const Maison = localFont({
	fallback: ['Helvetica', 'Sans-Serif'],
	src: [
		{
			path: '../public/fonts/MaisonNeueWEB-Bold.woff2',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../public/fonts/MaisonNeueWEB-Medium.woff2',
			weight: '400',
			style: 'normal',
		},
	],
});

const Mono = localFont({
	fallback: ['Helvetica', 'Sans-Serif'],
	src: '../public/fonts/MaisonNeueWEB-Bold.woff2',
	weight: '400',
	style: 'normal',
});

export const dynamic = 'force-static';

export default async function RootLayout({ children, project, about }: LayoutProps<'/'>) {
	return (
		<html lang={'sv-SE'} className={`${Maison.className} ${Mono.className}`}>
			<body id='root'>
				<NavBar />
				{project}
				{about}
				<Cursor />
				<main>{children}</main>
			</body>
		</html>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery(GlobalDocument);

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		alternates: { canonical: '/' },
		title: {
			template: `${globalSeo?.siteName} — %s`,
			default: globalSeo?.siteName,
		},
		description: globalSeo?.fallbackSeo?.description,
		image: globalSeo?.fallbackSeo?.image?.url,
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		openGraph: {
			title: globalSeo?.siteName,
			description: globalSeo?.fallbackSeo?.description,
			url: process.env.NEXT_PUBLIC_SITE_URL,
			siteName: globalSeo?.siteName,
			images: [
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=1200&h=630&fit=fill&q=80`,
					width: 800,
					height: 600,
					alt: globalSeo?.siteName,
				},
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=1600&h=800&fit=fill&q=80`,
					width: 1600,
					height: 800,
					alt: globalSeo?.siteName,
				},
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=790&h=627&fit=crop&q=80`,
					width: 790,
					height: 627,
					alt: globalSeo?.siteName,
				},
			],
			locale: 'sv_SE',
			type: 'website',
		},
	} as Metadata;
}

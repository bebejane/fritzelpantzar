import { buildRoute } from '@lib/routes';
import { revalidate } from 'next-dato-utils/route-handlers'

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity: { id, attributes } } = payload;
    const paths: string[] = []
    const tags: string[] = [id]

    paths.push(await buildRoute(api_key, attributes))

    api_key && tags.push(api_key)
    return revalidate(paths, tags)
  })
}
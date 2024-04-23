import { buildRoute } from '@lib/routes';
import { revalidate } from 'next-dato-utils/route-handlers'

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity: { id, attributes } } = payload;
    const paths: string[] = []
    const tags: string[] = [id]

    const p = await buildRoute(api_key, attributes)
    paths.push.apply(paths, Array.isArray(p) ? p : [p])

    api_key && tags.push(api_key)
    return revalidate(paths, tags)
  })
}
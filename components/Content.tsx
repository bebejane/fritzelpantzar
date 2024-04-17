import { StructuredContent } from 'next-dato-utils/components'
//import * as blocks from './blocks'

export type Props = {
  content: any
  className?: string
}


export default function Content({ content, className }: Props) {

  if (!content)
    return null

  return (
    <StructuredContent
      className={className}
      content={content}
    //blocks={blocks}
    />
  )
}
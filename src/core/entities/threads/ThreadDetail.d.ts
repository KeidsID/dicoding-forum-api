import type Reply from './comments/replies/Reply'

export default interface ThreadDetail {
  id: string
  title: string
  body: string
  date: Date
  username: string
  comments: Array<{
    id: string
    username: string
    date: Date
    content: string
    likeCount: number
    replies: Reply[]
  }>
}

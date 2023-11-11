export default class Comment {
  id: string
  username: string
  date: Date
  content: string
  likeCount: number

  /**
   * Create a [Comment] object.
   *
   * [content] will replaced if [isDeleted] is true.
   */
  constructor (args: {
    id: string
    username: string
    date: Date
    content: string
    likeCount: number
    isDeleted: boolean
  }) {
    this.id = args.id
    this.username = args.username
    this.date = args.date
    this.likeCount = args.likeCount
    this.content = args.isDeleted ? '**komentar telah dihapus**' : args.content
  }
}

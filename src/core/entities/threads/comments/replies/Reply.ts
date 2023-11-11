export default class Reply {
  id: string
  username: string
  date: Date
  content: string

  /**
   * Create a [Reply] object.
   *
   * [content] will replaced if [isDeleted] is true.
   */
  constructor (args: {
    id: string
    username: string
    date: Date
    content: string
    isDeleted: boolean
  }) {
    this.id = args.id
    this.username = args.username
    this.date = args.date
    this.content = args.isDeleted ? '**balasan telah dihapus**' : args.content
  }
}

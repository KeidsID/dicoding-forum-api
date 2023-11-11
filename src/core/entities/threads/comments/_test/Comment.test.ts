import Comment from '../Comment'

describe('a Comment entity', () => {
  it('should create Comment object correctly', () => {
    const args = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment',
      likeCount: 0,
      isDeleted: false
    }

    const comment = new Comment(args)

    expect(comment.id).toStrictEqual(args.id)
    expect(comment.username).toStrictEqual(args.username)
    expect(comment.date).toStrictEqual(args.date)
    expect(comment.content).toStrictEqual(args.content)
    expect(comment.likeCount).toStrictEqual(args.likeCount)
  })

  it('should modify content when isDeleted argument on constructor is true', () => {
    const args = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment',
      likeCount: 0,
      isDeleted: true
    }

    const comment = new Comment(args)

    expect(comment.id).toStrictEqual(args.id)
    expect(comment.username).toStrictEqual(args.username)
    expect(comment.date).toStrictEqual(args.date)
    expect(comment.content).toStrictEqual('**komentar telah dihapus**')
  })
})

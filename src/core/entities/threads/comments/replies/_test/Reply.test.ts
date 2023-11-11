import Reply from '../Reply'

describe('a Reply entity', () => {
  it('should create Reply object correctly', () => {
    // Arrange
    const args = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A reply',
      isDeleted: false
    }

    // Action
    const reply = new Reply(args)

    // Assert
    expect(reply.id).toStrictEqual(args.id)
    expect(reply.username).toStrictEqual(args.username)
    expect(reply.date).toStrictEqual(args.date)
    expect(reply.content).toStrictEqual(args.content)
  })

  it('should modify content when isDeleted argument on constructor is true', () => {
    // Arrange
    const args = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A reply',
      isDeleted: true
    }

    // Action
    const reply = new Reply(args)

    // Assert
    expect(reply.id).toStrictEqual(args.id)
    expect(reply.username).toStrictEqual(args.username)
    expect(reply.date).toStrictEqual(args.date)
    expect(reply.content).toStrictEqual('**balasan telah dihapus**')
  })
})

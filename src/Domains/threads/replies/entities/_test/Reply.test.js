const Reply = require('../Reply')

describe('a Reply entity', () => {
  it('should throw error when args did not contain needed property', () => {
    // AAA
    expect(() => new Reply({})).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when args did not meet data type specification', () => {
    // Arrange
    const args = {
      id: 'reply-123',
      username: 'dicoding',
      date: Date.now(),
      content: 'A reply',
      isDeleted: false
    }

    // Action and Assert
    expect(() => new Reply(args)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

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

  it('should create Reply object correctly with modified content when isDeleted argument is true', () => {
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

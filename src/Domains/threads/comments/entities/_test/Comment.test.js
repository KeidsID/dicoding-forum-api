const Comment = require('../Comment')

describe('a Comment entity', () => {
  it('should throw error when args did not contain needed property', () => {
    // AAA
    expect(() => new Comment({})).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when args did not meet data type specification', () => {
    // Arrange
    const args = {
      id: 'comment-123',
      username: 'dicoding',
      date: Date.now(),
      content: 'A comment',
      likeCount: 0,
      isDeleted: false
    }

    // Action and Assert
    expect(() => new Comment(args)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment object correctly', () => {
    // Arrange
    const args = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment',
      likeCount: 0,
      isDeleted: false
    }

    // Action
    const comment = new Comment(args)

    // Assert
    expect(comment.id).toStrictEqual(args.id)
    expect(comment.username).toStrictEqual(args.username)
    expect(comment.date).toStrictEqual(args.date)
    expect(comment.content).toStrictEqual(args.content)
    expect(comment.likeCount).toStrictEqual(args.likeCount)
  })

  it('should create Comment object correctly with modified content when isDeleted argument is true', () => {
    // Arrange
    const args = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment',
      likeCount: 0,
      isDeleted: true
    }

    // Action
    const comment = new Comment(args)

    // Assert
    expect(comment.id).toStrictEqual(args.id)
    expect(comment.username).toStrictEqual(args.username)
    expect(comment.date).toStrictEqual(args.date)
    expect(comment.content).toStrictEqual('**komentar telah dihapus**')
  })
})

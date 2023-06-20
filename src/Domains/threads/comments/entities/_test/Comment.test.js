const Comment = require('../Comment')

describe('a Comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: Date.now(),
      content: 'A comment'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment'
    }

    // Action
    const { id, username, date, content } = new Comment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(date).toEqual(payload.date)
    expect(content).toEqual(payload.content)
  })
})

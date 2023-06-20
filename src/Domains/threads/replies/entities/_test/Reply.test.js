const Reply = require('../Reply')

describe('a Reply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
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
    expect(() => new Reply(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment'
    }

    // Action
    const { id, username, date, content } = new Reply(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(date).toEqual(payload.date)
    expect(content).toEqual(payload.content)
  })
})

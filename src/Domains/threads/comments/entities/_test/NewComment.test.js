const NewComment = require('../NewComment')

describe('a NewComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123
    }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      content: 'A comment'
    }

    // Action
    const newComment = new NewComment(payload)

    // Assert
    expect(newComment.content).toEqual(payload.content)
  })
})

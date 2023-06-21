const AddedReply = require('../AddedReply')

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'dicoding',
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      content: 'dicoding',
      owner: 'user-123'
    }

    // Action
    const addedReply = new AddedReply(payload)

    // Assert
    expect(addedReply.id).toStrictEqual(payload.id)
    expect(addedReply.content).toStrictEqual(payload.content)
    expect(addedReply.owner).toStrictEqual(payload.owner)
  })
})

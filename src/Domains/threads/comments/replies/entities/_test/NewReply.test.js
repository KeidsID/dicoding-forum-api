const NewReply = require('../NewReply')

describe('a NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123
    }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      content: 'A reply'
    }

    // Action
    const newReply = new NewReply(payload)

    // Assert
    expect(newReply.content).toStrictEqual(payload.content)
  })
})

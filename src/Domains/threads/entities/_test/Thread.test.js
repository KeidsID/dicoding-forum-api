const Thread = require('../Thread')

describe('a Thread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc'
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'thread body',
      date: Date.now(),
      username: 'fulan'
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'thread body',
      date: new Date(),
      username: 'fulan'
    }

    // Action
    const thread = new Thread(payload)

    // Assert
    expect(thread.id).toStrictEqual(payload.id)
    expect(thread.title).toStrictEqual(payload.title)
    expect(thread.body).toStrictEqual(payload.body)
    expect(thread.date).toStrictEqual(payload.date)
    expect(thread.username).toStrictEqual(payload.username)
  })
})

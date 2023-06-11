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
      title: 'abc',
      body: 123
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      title: 'A thread',
      body: 'A thread body'
    }

    // Action
    const { title, body } = new Thread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })
})

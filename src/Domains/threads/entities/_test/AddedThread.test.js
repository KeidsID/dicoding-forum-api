const AddedThread = require('../AddedThread')

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      owner: 'Dicoding Indonesia'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'dicoding',
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      title: 'dicoding',
      owner: 'user-123'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread.id).toStrictEqual(payload.id)
    expect(addedThread.title).toStrictEqual(payload.title)
    expect(addedThread.owner).toStrictEqual(payload.owner)
  })
})

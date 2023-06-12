const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../Domains/threads/entities/Thread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  it('should orchestracting the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'A thread',
      body: 'A thread body'
    }
    const owner = 'user-123'

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: payload.title,
      owner
    })

    const mockThreadsRepository = new ThreadsRepository()

    mockThreadsRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))

    const addThreadUseCase = new AddThreadUseCase({
      threadsRepository: mockThreadsRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(payload, owner)

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: payload.title,
      owner
    }))

    expect(mockThreadsRepository.addThread).toBeCalledWith(
      new Thread({ title: payload.title, body: payload.body }),
      owner
    )
  })
})

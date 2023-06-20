const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../../Domains/threads/entities/Thread')

const GetThreadByIdUsecase = require('../GetThreadByIdUsecase')

describe('GetThreadByIdUsecase', () => {
  it('should orchestracting the get thread by id action correctly', async () => {
    // Arrange
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
      date: new Date('2023-06-17T15:10:13.956Z'),
      username: 'dicoding'
    })

    const mockThreadsRepo = new ThreadsRepository()

    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

    const usecase = new GetThreadByIdUsecase({
      threadsRepository: mockThreadsRepo
    })

    // Action
    const thread = await usecase.execute('thread-123')

    // Assert
    expect(thread).toStrictEqual(new Thread({
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
      date: new Date('2023-06-17T15:10:13.956Z'),
      username: 'dicoding'
    }))

    expect(mockThreadsRepo.getThreadById).toBeCalledWith('thread-123')
  })
})

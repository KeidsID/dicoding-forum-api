const ThreadCommentsRepository = require('../../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../Domains/threads/entities/Thread')

const SoftDeleteCommentUsecase = require('../SoftDeleteCommentUsecase')

describe('SoftDeleteCommentUsecase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentsRepo.softDeleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.getThreadById = jest.fn().mockImplementation(
      () => Promise.resolve(new Thread({
        id: 'thread-123',
        title: 'A thread',
        body: 'A thread body',
        date: new Date(),
        username: 'dicoding'
      }))
    )

    const usecase = new SoftDeleteCommentUsecase({
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    await usecase.execute('thread-123', 'comment-123', 'user-123')

    // Assert
    expect(mockThreadsRepo.getThreadById).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.softDeleteCommentById).toBeCalledWith(
      'comment-123', 'user-123'
    )
  })
})

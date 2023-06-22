const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../../../Domains/threads/entities/Thread')

const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')

const SoftDeleteCommentUsecase = require('../SoftDeleteCommentUsecase')

describe('SoftDeleteCommentUsecase', () => {
  it('should orchestracting the delete comment action correctly', async () => {
    // Arrange
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'thread',
      body: 'thread body',
      date: new Date(),
      username: 'dicoding'
    })

    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentsRepo.softDeleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

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

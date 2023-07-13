const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')
const ThreadCommentLikesRepository = require('../../../../../Domains/threads/comments/ThreadCommentLikesRepository')
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')
const LikeOrDislikeCommentUseCase = require('../LikeOrDislikeCommentUseCase')

describe('LikeOrDislikeCommentUseCase', () => {
  const threadId = 'thread-123'
  const commentId = 'comment-123'
  const userId = 'user-123'

  const mockThreadsRepo = new ThreadsRepository()
  const mockThreadCommentsRepo = new ThreadCommentsRepository()

  mockThreadsRepo.verifyThread = jest.fn(() => Promise.resolve())
  mockThreadCommentsRepo.verifyCommentLocation = jest.fn(() => Promise.resolve())

  it('should orchestracting the like comment action correctly', async () => {
    // Arrange
    const mockThreadCommentLikesRepo = new ThreadCommentLikesRepository()

    mockThreadCommentLikesRepo.verifyCommentLike = jest.fn(() => Promise.resolve(false))
    mockThreadCommentLikesRepo.likeAComment = jest.fn(() => Promise.resolve())
    mockThreadCommentLikesRepo.dislikeAComment = jest.fn(() => Promise.resolve())

    const usecase = new LikeOrDislikeCommentUseCase({
      threadsRepository: mockThreadsRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadCommentLikesRepository: mockThreadCommentLikesRepo
    })

    // Action
    await usecase.execute(threadId, commentId, userId)

    // Assert
    expect(mockThreadsRepo.verifyThread).toBeCalledWith(threadId)
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      commentId, threadId
    )
    expect(mockThreadCommentLikesRepo.verifyCommentLike).toBeCalledWith(
      commentId, userId
    )
    expect(mockThreadCommentLikesRepo.likeAComment).toBeCalledWith(
      commentId, userId
    )
    expect(mockThreadCommentLikesRepo.dislikeAComment).toBeCalledTimes(0)
  })

  it('should orchestracting the dislike comment action correctly', async () => {
    // Arrange
    const mockThreadCommentLikesRepo = new ThreadCommentLikesRepository()

    mockThreadCommentLikesRepo.verifyCommentLike = jest.fn(() => Promise.resolve(true))
    mockThreadCommentLikesRepo.likeAComment = jest.fn(() => Promise.resolve())
    mockThreadCommentLikesRepo.dislikeAComment = jest.fn(() => Promise.resolve())

    const usecase = new LikeOrDislikeCommentUseCase({
      threadsRepository: mockThreadsRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadCommentLikesRepository: mockThreadCommentLikesRepo
    })

    // Action
    await usecase.execute(threadId, commentId, userId)

    // Assert
    expect(mockThreadsRepo.verifyThread).toBeCalledWith(threadId)
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      commentId, threadId
    )
    expect(mockThreadCommentLikesRepo.verifyCommentLike).toBeCalledWith(
      commentId, userId
    )
    expect(mockThreadCommentLikesRepo.likeAComment).toBeCalledTimes(0)
    expect(mockThreadCommentLikesRepo.dislikeAComment).toBeCalledWith(
      commentId, userId
    )
  })
})

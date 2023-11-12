import { mock } from 'ts-jest-mocker'

// ./src/core/
import type ThreadsRepo from '../../../../repo/threads/ThreadsRepo'
import type ThreadCommentLikesRepo from '../../../../repo/threads/ThreadCommentLikesRepo'
import type ThreadCommentsRepo from '../../../../repo/threads/ThreadCommentsRepo'

import LikeOrDislikeComment from '../LikeOrDislikeComment'

describe('LikeOrDislikeComment', () => {
  const threadId = 'thread-123'
  const commentId = 'comment-123'
  const userId = 'user-123'

  const mockThreadsRepo = mock<ThreadsRepo>()
  const mockThreadCommentsRepo = mock<ThreadCommentsRepo>()

  mockThreadsRepo.verifyThread = jest.fn()
    .mockImplementation(async () => { await Promise.resolve() })
  mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
    .mockImplementation(async () => { await Promise.resolve() })

  it('should orchestracting the like comment action correctly', async () => {
    // Arrange
    const mockThreadCommentLikesRepo = mock<ThreadCommentLikesRepo>()

    mockThreadCommentLikesRepo.verifyCommentLike = jest.fn()
      .mockImplementation(async () => await Promise.resolve(false))
    mockThreadCommentLikesRepo.likeAComment = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockThreadCommentLikesRepo.dislikeAComment = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const usecase = new LikeOrDislikeComment({
      threadsRepo: mockThreadsRepo,
      threadCommentsRepo: mockThreadCommentsRepo,
      threadCommentLikesRepo: mockThreadCommentLikesRepo
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
    const mockThreadCommentLikesRepo = mock<ThreadCommentLikesRepo>()

    mockThreadCommentLikesRepo.verifyCommentLike = jest.fn()
      .mockImplementation(async () => await Promise.resolve(true))
    mockThreadCommentLikesRepo.likeAComment = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockThreadCommentLikesRepo.dislikeAComment = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const usecase = new LikeOrDislikeComment({
      threadsRepo: mockThreadsRepo,
      threadCommentsRepo: mockThreadCommentsRepo,
      threadCommentLikesRepo: mockThreadCommentLikesRepo
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

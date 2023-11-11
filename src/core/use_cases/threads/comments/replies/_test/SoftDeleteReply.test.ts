import { mock } from 'ts-jest-mocker'

import type ThreadsRepo from '../../../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../../../repo/threads/ThreadCommentsRepo'
import type ThreadCommentRepliesRepo from '../../../../../repo/threads/ThreadCommentRepliesRepo'

import SoftDeleteReply from '../SoftDeleteReply'

describe('SoftDeleteReply use case', () => {
  it('should orchestracting the delete reply action correctly', async () => {
    // Arrange
    const mockThreadCommentRepliesRepo = mock<ThreadCommentRepliesRepo>()
    const mockThreadCommentsRepo = mock<ThreadCommentsRepo>()
    const mockThreadsRepo = mock<ThreadsRepo>()

    mockThreadCommentRepliesRepo.softDeleteReply = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const usecase = new SoftDeleteReply({
      threadCommentRepliesRepo: mockThreadCommentRepliesRepo,
      threadCommentsRepo: mockThreadCommentsRepo,
      threadsRepo: mockThreadsRepo
    })

    // Action
    await usecase.execute('thread-123', 'comment-123', 'reply-123', 'user-123')

    // Assert
    expect(mockThreadsRepo.verifyThread).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      'comment-123', 'thread-123'
    )
    expect(mockThreadCommentRepliesRepo.softDeleteReply).toBeCalledWith(
      'reply-123', 'user-123'
    )
  })
})

import { mock } from 'ts-jest-mocker'

import type ThreadsRepo from 'src/core/repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from 'src/core/repo/threads/ThreadCommentsRepo'

import SoftDeleteComment from '../SoftDeleteComment'

describe('SoftDeleteComment', () => {
  it('should orchestracting the delete comment action correctly', async () => {
    // Arrange
    const mockThreadCommentsRepo = mock<ThreadCommentsRepo>()
    const mockThreadsRepo = mock<ThreadsRepo>()

    mockThreadCommentsRepo.softDeleteCommentById = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const usecase = new SoftDeleteComment({
      threadCommentsRepo: mockThreadCommentsRepo,
      threadsRepo: mockThreadsRepo
    })

    // Action
    await usecase.execute('thread-123', 'comment-123', 'user-123')

    // Assert
    expect(mockThreadsRepo.verifyThread).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.softDeleteCommentById).toBeCalledWith(
      'comment-123', 'user-123'
    )
  })
})

import { mock } from 'ts-jest-mocker'

import type AddedComment from 'src/core/entities/threads/comments/AddedComment'
import type NewComment from 'src/core/entities/threads/comments/NewComment'
import type ThreadsRepo from 'src/core/repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from 'src/core/repo/threads/ThreadCommentsRepo'

import AddCommentToThread from '../AddCommentToThread'

describe('AddCommentToThread use case', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const threadToComment = 'thread-123'
    const payload: NewComment = { content: 'A comment' }
    const owner = 'user-123'

    const mockAddedComment: AddedComment = {
      id: 'comment-123',
      content: payload.content,
      owner
    }

    const mockThreadCommentsRepo = mock<ThreadCommentsRepo>()
    const mockThreadsRepo = mock<ThreadsRepo>()

    mockThreadCommentsRepo.addCommentToThread = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockAddedComment))
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const addCommentToThreadUseCase = new AddCommentToThread({
      threadCommentsRepo: mockThreadCommentsRepo,
      threadsRepo: mockThreadsRepo
    })

    // Action
    const addedComment = await addCommentToThreadUseCase.execute(threadToComment, payload, owner)

    // Assert
    expect(addedComment).toStrictEqual({
      id: 'comment-123', content: 'A comment', owner
    } satisfies AddedComment)

    expect(mockThreadsRepo.verifyThread).toBeCalledWith(threadToComment)
    expect(mockThreadCommentsRepo.addCommentToThread).toBeCalledWith(
      threadToComment, payload, owner
    )
  })
})

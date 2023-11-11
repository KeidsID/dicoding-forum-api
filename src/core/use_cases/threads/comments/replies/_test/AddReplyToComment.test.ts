import { mock } from 'ts-jest-mocker'

import type AddedReply from '../../../../../entities/threads/comments/replies/AddedReply'
import type NewReply from '../../../../../entities/threads/comments/replies/NewReply'
import type ThreadsRepo from '../../../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../../../repo/threads/ThreadCommentsRepo'
import type ThreadCommentRepliesRepo from '../../../../../repo/threads/ThreadCommentRepliesRepo'

import AddReplyToCommentUseCase from '../AddReplyToComment'

describe('AddReplyToCommentUseCase', () => {
  it('should orchestracting the add reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const payload: NewReply = { content: 'A reply' }
    const owner = 'user-123'

    const mockAddedReply: AddedReply = {
      id: 'reply-123',
      content: payload.content,
      owner
    }

    const mockThreadCommentRepliesRepo = mock<ThreadCommentRepliesRepo>()
    const mockThreadCommentsRepo = mock<ThreadCommentsRepo>()
    const mockThreadsRepo = mock<ThreadsRepo>()

    mockThreadCommentRepliesRepo.addReplyToComment = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockAddedReply))
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const addCommentToThreadUseCase = new AddReplyToCommentUseCase({
      threadCommentRepliesRepo: mockThreadCommentRepliesRepo,
      threadCommentsRepo: mockThreadCommentsRepo,
      threadsRepo: mockThreadsRepo
    })

    // Action
    const addedReply = await addCommentToThreadUseCase.execute(
      threadId, commentId, payload, owner
    )

    // Assert
    expect(addedReply).toStrictEqual({
      id: 'reply-123', content: payload.content, owner
    } satisfies AddedReply)

    expect(mockThreadsRepo.verifyThread).toBeCalledWith(threadId)
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      commentId, threadId
    )
    expect(mockThreadCommentRepliesRepo.addReplyToComment).toBeCalledWith(
      commentId, payload, owner
    )
  })
})

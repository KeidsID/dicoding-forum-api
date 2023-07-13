const ThreadsRepository = require('../../../../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentRepliesRepository = require('../../../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository')
const AddedReply = require('../../../../../../Domains/threads/comments/replies/entities/AddedReply')
const NewReply = require('../../../../../../Domains/threads/comments/replies/entities/NewReply')

const AddReplyToCommentUseCase = require('../AddReplyToCommentUseCase')

describe('AddReplyToCommentUseCase', () => {
  it('should orchestracting the add reply action correctly', async () => {
    // Arrange
    const payload = {
      content: 'A reply'
    }
    const owner = 'user-123'

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner
    })

    const mockThreadCommentRepliesRepo = new ThreadCommentRepliesRepository()
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentRepliesRepo.addReplyToComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const addCommentToThreadUseCase = new AddReplyToCommentUseCase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    const addedReply = await addCommentToThreadUseCase.execute(
      'thread-123', 'comment-123', payload, owner
    )

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123', content: payload.content, owner
    }))

    expect(mockThreadsRepo.verifyThread).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      'comment-123', 'thread-123'
    )
    expect(mockThreadCommentRepliesRepo.addReplyToComment).toBeCalledWith(
      'comment-123', new NewReply(payload), owner
    )
  })
})

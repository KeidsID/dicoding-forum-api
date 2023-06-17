const AddedComment = require('../../../../Domains/threads/entities/AddedComment')
const NewReply = require('../../../../Domains/threads/entities/NewReply')
const Thread = require('../../../../Domains/threads/entities/Thread')
const ThreadCommentRepliesRepository = require('../../../../Domains/threads/ThreadCommentRepliesRepository')
const ThreadCommentsRepository = require('../../../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')

const AddReplyToCommentUsecase = require('../AddReplyToCommentUsecase')

describe('AddReplyToCommentUsecase', () => {
  it('should orchestracting the add reply action correctly', async () => {
    // Arrange
    const payload = {
      content: 'A reply'
    }
    const owner = 'user-123'

    const mockAddedReply = new AddedComment({
      id: 'reply-123',
      content: payload.content,
      owner
    })
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
      date: new Date(),
      username: 'dicoding'
    })

    const mockThreadCommentRepliesRepo = new ThreadCommentRepliesRepository()
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentRepliesRepo.addReplyToComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

    const addCommentToThreadUsecase = new AddReplyToCommentUsecase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    const addedReply = await addCommentToThreadUsecase.execute(
      mockThread.id, 'comment-123',
      payload, owner
    )

    // Assert
    expect(addedReply).toStrictEqual(mockAddedReply)

    expect(mockThreadsRepo.getThreadById).toBeCalledWith(mockThread.id)
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      'comment-123', mockThread.id
    )
    expect(mockThreadCommentRepliesRepo.addReplyToComment).toBeCalledWith(
      'comment-123', new NewReply(payload), owner
    )
  })
})

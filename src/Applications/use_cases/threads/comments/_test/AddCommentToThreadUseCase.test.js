const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')

const AddedComment = require('../../../../../Domains/threads/comments/entities/AddedComment')
const NewComment = require('../../../../../Domains/threads/comments/entities/NewComment')
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')

const AddCommentToThreadUseCase = require('../AddCommentToThreadUseCase')

describe('AddCommentToThreadUseCase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'A comment'
    }
    const owner = 'user-123'

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: payload.content,
      owner
    })

    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentsRepo.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const addCommentToThreadUseCase = new AddCommentToThreadUseCase({
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    const addedComment = await addCommentToThreadUseCase.execute('thread-123', payload, owner)

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123', content: 'A comment', owner
    }))

    expect(mockThreadsRepo.verifyThread).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.addCommentToThread).toBeCalledWith(
      'thread-123', new NewComment(payload), owner
    )
  })
})

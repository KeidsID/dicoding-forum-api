const pool = require('../../../database/postgres/pool')
const AuthorizationError = require('../../../../Common/exceptions/AuthorizationError')
const NotFoundError = require('../../../../Common/exceptions/NotFoundError')

const ThreadCommentsRepositoryPostgres = require('../ThreadCommentsRepositoryPostgres')
const AddedComment = require('../../../../Domains/threads/comments/entities/AddedComment')
const NewComment = require('../../../../Domains/threads/comments/entities/NewComment')

const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../../tests/ThreadCommentsTableTestHelper')
const ClientError = require('../../../../Common/exceptions/ClientError')

describe('ThreadCommentsRepositoryPostgres', () => {
  const dummyUser = {
    id: 'user-123',
    username: 'dicoding'
  }
  const dummyUser2 = {
    id: 'user-xyz',
    username: 'fulan'
  }
  const dummyThread = {
    id: 'thread-123',
    owner: 'user-123'
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ ...dummyUser })
    await UsersTableTestHelper.addUser({ ...dummyUser2 })
    await ThreadsTableTestHelper.addThread({ ...dummyThread })
  })

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addCommentToThread method', () => {
    it('should presist comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'A comment' })
      const fakeIdGen = () => '123'

      const repo = new ThreadCommentsRepositoryPostgres(pool, fakeIdGen)

      // Action
      await repo.addCommentToThread(dummyThread.id, newComment, dummyUser.id)

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findCommentById('comment-123')

      expect(comments).toHaveLength(1)
    })

    it('should return AddedComment correctly', async () => {
      // Arrange
      const newComment = new NewComment({ content: 'A comment' })
      const fakeIdGen = () => '123'

      const repo = new ThreadCommentsRepositoryPostgres(pool, fakeIdGen)

      // Action
      const addedComment = await repo.addCommentToThread(dummyThread.id, newComment, dummyUser.id)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: dummyUser.id
      }))
    })
  })

  describe('verifyCommentAccess method', () => {
    it('should throw NotFoundError if comment is not found', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repo.verifyCommentAccess('comment-123', dummyUser.id))
        .rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError if user is not the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      await ThreadCommentsTableTestHelper.addCommentToThread({ id: 'comment-123', owner: dummyUser.id })

      // Action & Assert
      await expect(repo.verifyCommentAccess('comment-123', dummyUser2.id))
        .rejects.toThrowError(AuthorizationError)
    })

    it('should not throw ClientError if the comment exist and user is the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      await ThreadCommentsTableTestHelper.addCommentToThread({ id: 'comment-123', owner: dummyUser.id })

      // Action & Assert
      await expect(repo.verifyCommentAccess('comment-123', dummyUser.id))
        .resolves.not.toThrowError(ClientError)
    })
  })

  describe('softDeleteCommentById method', () => {
    it('should call verifyCommentAccess method', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      const spyVerifyCommentAccessMethod = jest.spyOn(repo, 'verifyCommentAccess')

      await ThreadCommentsTableTestHelper.addCommentToThread({ id: 'comment-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteCommentById('comment-123', dummyUser.id)

      // Assert
      expect(spyVerifyCommentAccessMethod).toBeCalledWith(
        'comment-123', dummyUser.id
      )
    })

    it('should update the comment delete status', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      await ThreadCommentsTableTestHelper.addCommentToThread({ id: 'comment-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteCommentById('comment-123', dummyUser.id)

      // Assert
      const [comment] = await ThreadCommentsTableTestHelper.findCommentById('comment-123')

      expect(comment.is_deleted).toEqual(true)
    })
  })

  describe('getCommentsFromThread method', () => {
    it('should return empty array if no comment are found', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      // Action
      const comments = await repo.getCommentsFromThread(dummyThread.id)

      // Assert
      expect(comments).toEqual([])
    })

    it('should return array of comments with expected comment value', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      await ThreadCommentsTableTestHelper.addCommentToThread({
        commentId: 'comment-123',
        content: 'A comment',
        owner: dummyUser.id
      })

      // Action
      const [comment] = await repo.getCommentsFromThread(dummyThread.id)

      // Assert
      expect(comment.id).toStrictEqual('comment-123')
      expect(comment.username).toStrictEqual(dummyUser.username)
      expect(comment.content).toStrictEqual('A comment')
      expect(comment.date.getDate()).toStrictEqual(new Date().getDate())
    })

    it('should return array of comments with custom content if comment is soft deleted', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      await ThreadCommentsTableTestHelper.addCommentToThread({
        commentId: 'comment-123',
        content: 'A comment',
        owner: dummyUser.id
      })
      await ThreadCommentsTableTestHelper.addCommentToThread({
        commentId: 'comment-xyz',
        content: 'A comment',
        owner: dummyUser2.id
      })

      await ThreadCommentsTableTestHelper.softDeleteComment('comment-xyz')

      // Action
      const [comment, deletedComment] = await repo.getCommentsFromThread(dummyThread.id)

      // Assert
      expect(comment.id).toStrictEqual('comment-123')
      expect(comment.username).toStrictEqual(dummyUser.username)
      expect(comment.content).toStrictEqual('A comment')
      expect(comment.date.getDate()).toStrictEqual(new Date().getDate())

      expect(deletedComment.id).toStrictEqual('comment-xyz')
      expect(deletedComment.username).toStrictEqual(dummyUser2.username)
      expect(deletedComment.content).toStrictEqual('**komentar telah dihapus**')
      expect(deletedComment.date.getDate()).toStrictEqual(new Date().getDate())
    })
  })

  describe('verifyCommentLocation method', () => {
    // Arrange
    const repo = new ThreadCommentsRepositoryPostgres(pool, {})

    it('should throw NotFoundError if the comment is not found', async () => {
      // Action & Assert
      await expect(repo.verifyCommentLocation('comment-123', dummyThread.id))
        .rejects.toThrowError(new NotFoundError('komentar tidak ditemukan'))
    })

    it('should throw NotFoundError if the comment is invalid', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addCommentToThread({})

      // Action & Assert
      await expect(repo.verifyCommentLocation('comment-123', 'thread-xyz'))
        .rejects.toThrowError(new NotFoundError('komentar tidak ditemukan pada thread ini'))
    })

    it('should not throw NotFoundError if the comment is valid', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addCommentToThread({})

      // Action & Assert
      await expect(repo.verifyCommentLocation('comment-123', dummyThread.id))
        .resolves.not.toThrowError(NotFoundError)
    })
  })
})

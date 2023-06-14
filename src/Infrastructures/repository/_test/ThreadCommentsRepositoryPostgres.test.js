const AuthorizationError = require('../../../Common/exceptions/AuthorizationError')
const NotFoundError = require('../../../Common/exceptions/NotFoundError')
const AddedComment = require('../../../Domains/threads/entities/AddedComment')
const NewComment = require('../../../Domains/threads/entities/NewComment')
const pool = require('../../database/postgres/pool')
const ThreadCommentsRepositoryPostgres = require('../ThreadCommentsRepositoryPostgres')

const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

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

  describe('softDeleteCommentById method', () => {
    it('should throw NotFoundError if comment is not found', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repo.softDeleteCommentById('comment-123', dummyUser.id))
        .rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError if user is not the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentsRepositoryPostgres(pool, {})

      await ThreadCommentsTableTestHelper.addCommentToThread({ id: 'comment-123', owner: dummyUser.id })

      // Action & Assert
      await expect(repo.softDeleteCommentById('comment-123', dummyUser2.id))
        .rejects.toThrowError(AuthorizationError)
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

  describe('method', () => {
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
      expect(comment.date.getMinutes()).toStrictEqual(new Date().getMinutes())
    })

    it('should return comment with custom content if comment is soft deleted', async () => {
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
      expect(comment.date.getMinutes()).toStrictEqual(new Date().getMinutes())

      expect(deletedComment.id).toStrictEqual('comment-xyz')
      expect(deletedComment.username).toStrictEqual(dummyUser2.username)
      expect(deletedComment.content).toStrictEqual('**komentar telah dihapus**')
      expect(deletedComment.date.getMinutes()).toStrictEqual(new Date().getMinutes())
    })
  })
})

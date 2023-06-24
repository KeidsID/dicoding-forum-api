const pool = require('../../../database/postgres/pool')

const AuthorizationError = require('../../../../Common/exceptions/AuthorizationError')
const NotFoundError = require('../../../../Common/exceptions/NotFoundError')

const ThreadCommentRepliesRepositoryPostgres = require('../ThreadCommentRepliesRepositoryPostgres')

const AddedReply = require('../../../../Domains/threads/replies/entities/AddedReply')
const NewReply = require('../../../../Domains/threads/replies/entities/NewReply')

const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper')

const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentRepliesTableTestHelper = require('../../../../../tests/ThreadCommentRepliesTableTestHelper')

describe('ThreadCommentRepliesRepositoryPostgres', () => {
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
  const dummyComment = {
    id: 'comment-123',
    owner: 'user-123'
  }

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ ...dummyUser })
    await UsersTableTestHelper.addUser({ ...dummyUser2 })
    await ThreadsTableTestHelper.addThread({ ...dummyThread })
    await ThreadCommentsTableTestHelper.addCommentToThread({
      commentId: dummyComment.id,
      threadId: dummyThread.id,
      owner: dummyComment.owner
    })
  })

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addReplyToComment method', () => {
    it('should presist comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewReply({ content: 'A reply' })
      const fakeIdGen = () => '123'

      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, fakeIdGen)

      // Action
      await repo.addReplyToComment(dummyComment.id, newComment, dummyUser.id)

      // Assert
      const comments = await ThreadCommentRepliesTableTestHelper.findReplyById('reply-123')

      expect(comments).toHaveLength(1)
    })

    it('should return AddedReply correctly', async () => {
      // Arrange
      const newReply = new NewReply({ content: 'A reply' })
      const fakeIdGen = () => '123'

      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, fakeIdGen)

      // Action
      const addedReply = await repo.addReplyToComment(dummyComment.id, newReply, dummyUser.id)

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: newReply.content,
        owner: dummyUser.id
      }))
    })
  })

  describe('verifyReplyAccess method', () => {
    it('should throw NotFoundError if comment is not found', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repo.verifyReplyAccess('comment-123', dummyUser.id))
        .rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError if user is not the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      await ThreadCommentRepliesTableTestHelper.addReplyToComment({ id: 'reply-123', owner: dummyUser.id })

      // Action & Assert
      await expect(repo.verifyReplyAccess('reply-123', dummyUser2.id))
        .rejects.toThrowError(AuthorizationError)
    })
  })

  describe('softDeleteReply method', () => {
    it('should call verifyReplyAccess method', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      const spyVerifyReplyAccessMethod = jest.spyOn(repo, 'verifyReplyAccess')

      await ThreadCommentRepliesTableTestHelper.addReplyToComment({ id: 'reply-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteReply('reply-123', dummyUser.id)

      // Assert
      expect(spyVerifyReplyAccessMethod).toBeCalledWith(
        'reply-123', dummyUser.id
      )
    })

    it('should update the comment delete status', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      await ThreadCommentRepliesTableTestHelper.addReplyToComment({ id: 'reply-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteReply('reply-123', dummyUser.id)

      // Assert
      const [reply] = await ThreadCommentRepliesTableTestHelper.findReplyById('reply-123')

      expect(reply.is_deleted).toEqual(true)
    })
  })

  describe('getRepliesFromComment method', () => {
    it('should return empty array if no replies are found', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      // Action
      const replies = await repo.getRepliesFromComment(dummyComment.id)

      // Assert
      expect(replies).toEqual([])
    })

    it('should return array of replies with expected comment value', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      await ThreadCommentRepliesTableTestHelper.addReplyToComment({
        replyId: 'reply-123',
        commentId: dummyComment.id,
        content: 'A reply',
        owner: dummyUser.id
      })

      // Action
      const [reply] = await repo.getRepliesFromComment(dummyComment.id)

      // Assert
      expect(reply.id).toStrictEqual('reply-123')
      expect(reply.username).toStrictEqual(dummyUser.username)
      expect(reply.content).toStrictEqual('A reply')
      expect(reply.date.getDate()).toStrictEqual(new Date().getDate())
    })

    it('should return comment with custom content if comment is soft deleted', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepositoryPostgres(pool, {})

      await ThreadCommentRepliesTableTestHelper.addReplyToComment({
        replyId: 'reply-123',
        content: 'A reply',
        owner: dummyUser.id
      })
      await ThreadCommentRepliesTableTestHelper.addReplyToComment({
        replyId: 'reply-xyz',
        content: 'A reply',
        owner: dummyUser2.id
      })

      await ThreadCommentRepliesTableTestHelper.softDeleteReply('reply-xyz')

      // Action
      const [reply, deletedReply] = await repo.getRepliesFromComment(dummyComment.id)

      // Assert
      expect(reply.id).toStrictEqual('reply-123')
      expect(reply.username).toStrictEqual(dummyUser.username)
      expect(reply.content).toStrictEqual('A reply')
      expect(reply.date.getDate()).toStrictEqual(new Date().getDate())

      expect(deletedReply.id).toStrictEqual('reply-xyz')
      expect(deletedReply.username).toStrictEqual(dummyUser2.username)
      expect(deletedReply.content).toStrictEqual('**balasan telah dihapus**')
      expect(deletedReply.date.getDate()).toStrictEqual(new Date().getDate())
    })
  })
})

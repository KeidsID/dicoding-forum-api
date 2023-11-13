// ./src/
import HttpError from '../../../../common/error/HttpError'
import type AddedReply from '../../../../core/entities/threads/comments/replies/AddedReply'
import type NewReply from '../../../../core/entities/threads/comments/replies/NewReply'

// ./src/infrastructures/
import pool from '../../../db/psql/pool'

// ./src/infrastructures/repo/threads/
import ThreadCommentRepliesRepoImpl from '../ThreadCommentRepliesRepoImpl'

// ./tests/
import ThreadsTableHelper from '../../../../../tests/helpers/ThreadsTableHelper'
import ThreadCommentsTableHelper from '../../../../../tests/helpers/ThreadCommentsTableHelper'
import ThreadCommentRepliesTableHelper from '../../../../../tests/helpers/ThreadCommentRepliesTableHelper'
import UsersTableHelper from '../../../../../tests/helpers/UsersTableHelper'

describe('ThreadCommentRepliesRepoImpl', () => {
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
    owner: dummyUser.id
  }
  const dummyComment = {
    id: 'comment-123',
    owner: dummyUser.id
  }
  const dummyComment2 = {
    id: 'comment-xyz',
    owner: dummyUser2.id
  }

  const fakeIdGen = (): string => '123'

  beforeAll(async () => {
    await UsersTableHelper.addUser({ ...dummyUser })
    await UsersTableHelper.addUser({ ...dummyUser2 })
    await ThreadsTableHelper.addThread({ ...dummyThread })
    await ThreadCommentsTableHelper.addCommentToThread({
      commentId: dummyComment.id,
      threadId: dummyThread.id,
      owner: dummyComment.owner
    })
    await ThreadCommentsTableHelper.addCommentToThread({
      commentId: dummyComment2.id,
      threadId: dummyThread.id,
      owner: dummyComment2.owner
    })
  })

  afterEach(async () => {
    await ThreadCommentRepliesTableHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableHelper.cleanTable()
    await pool.end()
  })

  describe('addReplyToComment method', () => {
    it('should presist comment and return added comment correctly', async () => {
      // Arrange
      const newReply: NewReply = { content: 'A reply' }

      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      // Action
      await repo.addReplyToComment(dummyComment.id, newReply, dummyUser.id)

      // Assert
      const comments = await ThreadCommentRepliesTableHelper.findReplyById('reply-123')

      expect(comments).toHaveLength(1)
    })

    it('should return AddedReply correctly', async () => {
      // Arrange
      const newReply: NewReply = { content: 'A reply' }

      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      // Action
      const addedReply = await repo.addReplyToComment(dummyComment.id, newReply, dummyUser.id)

      // Assert
      expect(addedReply).toStrictEqual({
        id: 'reply-123',
        content: newReply.content,
        owner: dummyUser.id
      } satisfies AddedReply)
    })
  })

  describe('verifyReplyAccess method', () => {
    it('should throw HttpError [404 Not Found] if comment is not found', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      // Action & Assert
      await expect(repo.verifyReplyAccess('comment-123', dummyUser.id)).rejects
        .toThrowError(HttpError.notFound('balasan tidak ditemukan'))
    })

    it('should throw HttpError [403 Forbidden] if user is not the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      await ThreadCommentRepliesTableHelper.addReplyToComment({
        replyId: 'reply-123', owner: dummyUser.id
      })

      // Action & Assert
      await expect(repo.verifyReplyAccess('reply-123', dummyUser2.id)).rejects
        .toThrowError(HttpError.forbidden('anda tidak dapat mengakses balasan orang lain'))
    })
  })

  describe('softDeleteReply method', () => {
    it('should call verifyReplyAccess method', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      const spyVerifyReplyAccessMethod = jest.spyOn(repo, 'verifyReplyAccess')

      await ThreadCommentRepliesTableHelper.addReplyToComment({
        replyId: 'reply-123', owner: dummyUser.id
      })

      // Action
      await repo.softDeleteReply('reply-123', dummyUser.id)

      // Assert
      expect(spyVerifyReplyAccessMethod).toBeCalledWith(
        'reply-123', dummyUser.id
      )
    })

    it('should update the comment delete status', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      await ThreadCommentRepliesTableHelper.addReplyToComment({ replyId: 'reply-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteReply('reply-123', dummyUser.id)

      // Assert
      const [reply] = await ThreadCommentRepliesTableHelper.findReplyById('reply-123')

      expect(reply.is_deleted).toEqual(true)
    })
  })

  describe('getRawRepliesFromComments method', () => {
    it('should return empty array if no replies are found', async () => {
      // Arrange
      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      // Action
      const replies = await repo.getRawRepliesFromComments([])

      // Assert
      expect(replies).toEqual([])
    })

    it('should return array of replies with expected raw reply value', async () => {
      // Arrange
      await ThreadCommentRepliesTableHelper.addReplyToComment({
        replyId: 'reply-123',
        commentId: dummyComment.id,
        content: 'A reply',
        owner: dummyUser.id
      })
      await ThreadCommentRepliesTableHelper.addReplyToComment({
        replyId: 'reply-xyz',
        commentId: dummyComment.id,
        content: 'A reply',
        owner: dummyUser.id
      })

      await ThreadCommentRepliesTableHelper.addReplyToComment({
        replyId: 'reply-ijk',
        commentId: dummyComment2.id,
        content: 'A reply',
        owner: dummyUser.id
      })
      await ThreadCommentRepliesTableHelper.addReplyToComment({
        replyId: 'reply-dummy',
        commentId: dummyComment2.id,
        content: 'A reply',
        owner: dummyUser2.id
      })

      const repo = new ThreadCommentRepliesRepoImpl(pool, fakeIdGen)

      // Action
      const rawReplies = await repo.getRawRepliesFromComments([dummyComment.id, dummyComment2.id])

      // Assert
      const expectedRawReplies = [
        {
          id: 'reply-123',
          username: dummyUser.username,
          content: 'A reply',
          date: new Date(),
          isDeleted: false,
          commentId: dummyComment.id
        },
        {
          id: 'reply-xyz',
          username: dummyUser.username,
          content: 'A reply',
          date: new Date(),
          isDeleted: false,
          commentId: dummyComment.id
        },
        {
          id: 'reply-ijk',
          username: dummyUser.username,
          content: 'A reply',
          date: new Date(),
          isDeleted: false,
          commentId: dummyComment2.id
        },
        {
          id: 'reply-dummy',
          username: dummyUser2.username,
          content: 'A reply',
          date: new Date(),
          isDeleted: false,
          commentId: dummyComment2.id
        }
      ]

      const commentRawReplies = rawReplies.filter((val) => val.commentId === dummyComment.id)
      const comment2RawReplies = rawReplies.filter((val) => val.commentId === dummyComment2.id)

      const expectedCommentRawReplies = expectedRawReplies.filter((val) => val.commentId === dummyComment.id)
      const expectedComment2RawReplies = expectedRawReplies.filter((val) => val.commentId === dummyComment2.id)

      expect(commentRawReplies[0].id).toStrictEqual(expectedCommentRawReplies[0].id)
      expect(commentRawReplies[0].username).toStrictEqual(expectedCommentRawReplies[0].username)
      expect(commentRawReplies[0].date.getDate()).toStrictEqual(expectedCommentRawReplies[0].date.getDate())
      expect(commentRawReplies[0].content).toStrictEqual(expectedCommentRawReplies[0].content)
      expect(commentRawReplies[0].isDeleted).toStrictEqual(expectedCommentRawReplies[0].isDeleted)
      expect(commentRawReplies[0].commentId).toStrictEqual(expectedCommentRawReplies[0].commentId)

      expect(commentRawReplies[1].id).toStrictEqual(expectedCommentRawReplies[1].id)
      expect(commentRawReplies[1].username).toStrictEqual(expectedCommentRawReplies[1].username)
      expect(commentRawReplies[1].date.getDate()).toStrictEqual(expectedCommentRawReplies[1].date.getDate())
      expect(commentRawReplies[1].content).toStrictEqual(expectedCommentRawReplies[1].content)
      expect(commentRawReplies[1].isDeleted).toStrictEqual(expectedCommentRawReplies[1].isDeleted)
      expect(commentRawReplies[1].commentId).toStrictEqual(expectedCommentRawReplies[1].commentId)

      expect(comment2RawReplies[0].id).toStrictEqual(expectedComment2RawReplies[0].id)
      expect(comment2RawReplies[0].username).toStrictEqual(expectedComment2RawReplies[0].username)
      expect(comment2RawReplies[0].date.getDate()).toStrictEqual(expectedComment2RawReplies[0].date.getDate())
      expect(comment2RawReplies[0].content).toStrictEqual(expectedComment2RawReplies[0].content)
      expect(comment2RawReplies[0].isDeleted).toStrictEqual(expectedComment2RawReplies[0].isDeleted)
      expect(comment2RawReplies[0].commentId).toStrictEqual(expectedComment2RawReplies[0].commentId)

      expect(comment2RawReplies[1].id).toStrictEqual(expectedComment2RawReplies[1].id)
      expect(comment2RawReplies[1].username).toStrictEqual(expectedComment2RawReplies[1].username)
      expect(comment2RawReplies[1].date.getDate()).toStrictEqual(expectedComment2RawReplies[1].date.getDate())
      expect(comment2RawReplies[1].content).toStrictEqual(expectedComment2RawReplies[1].content)
      expect(comment2RawReplies[1].isDeleted).toStrictEqual(expectedComment2RawReplies[1].isDeleted)
      expect(comment2RawReplies[1].commentId).toStrictEqual(expectedComment2RawReplies[1].commentId)
    })
  })
})

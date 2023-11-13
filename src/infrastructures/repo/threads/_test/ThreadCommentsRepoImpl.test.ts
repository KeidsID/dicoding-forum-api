// ./src/
import type AddedComment from '../../../../core/entities/threads/comments/AddedComment'
import type NewComment from '../../../../core/entities/threads/comments/NewComment'
import HttpError from '../../../../common/error/HttpError'

// ./src/infrastructures/
import pool from '../../../db/psql/pool'

// ./src/infrastructures/repo/threads/
import ThreadCommentsRepoImpl from '../ThreadCommentsRepoImpl'

// ./tests/
import UsersTableHelper from '../../../../../tests/helpers/UsersTableHelper'
import ThreadsTableHelper from '../../../../../tests/helpers/ThreadsTableHelper'
import ThreadCommentsTableHelper from '../../../../../tests/helpers/ThreadCommentsTableHelper'

describe('ThreadCommentsRepoImpl', () => {
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

  const fakeIdGen = (): string => '123'

  beforeAll(async () => {
    await UsersTableHelper.addUser({ ...dummyUser })
    await UsersTableHelper.addUser({ ...dummyUser2 })
    await ThreadsTableHelper.addThread({ ...dummyThread })
  })

  afterEach(async () => {
    await ThreadCommentsTableHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableHelper.cleanTable()
    await pool.end()
  })

  describe('addCommentToThread method', () => {
    it('should presist comment and return added comment correctly', async () => {
      // Arrange
      const newComment: NewComment = { content: 'A comment' }

      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      // Action
      await repo.addCommentToThread(dummyThread.id, newComment, dummyUser.id)

      // Assert
      const comments = await ThreadCommentsTableHelper.findCommentById('comment-123')

      expect(comments).toHaveLength(1)
    })

    it('should return AddedComment correctly', async () => {
      // Arrange
      const newComment: NewComment = { content: 'A comment' }

      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      // Action
      const addedComment = await repo.addCommentToThread(
        dummyThread.id, newComment, dummyUser.id
      )

      // Assert
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: newComment.content,
        owner: dummyUser.id
      } satisfies AddedComment)
    })
  })

  describe('verifyCommentAccess method', () => {
    it('should throw HttpError [404 Not Found] if comment is not found', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      // Action & Assert
      await expect(repo.verifyCommentAccess('comment-123', dummyUser.id)).rejects
        .toThrowError(HttpError.notFound('komentar tidak ditemukan'))
    })

    it('should throw HttpError [403 Forbidden] if user is not the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      await ThreadCommentsTableHelper.addCommentToThread({
        commentId: 'comment-123', owner: dummyUser.id
      })

      // Action & Assert
      await expect(repo.verifyCommentAccess('comment-123', dummyUser2.id)).rejects
        .toThrowError(HttpError.forbidden('anda tidak dapat mengakses komentar orang lain'))
    })

    it('should not throw Error if the comment exist and user is the comment owner', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      await ThreadCommentsTableHelper.addCommentToThread({ commentId: 'comment-123', owner: dummyUser.id })

      // Action & Assert
      await expect(repo.verifyCommentAccess('comment-123', dummyUser.id))
        .resolves.not.toThrow()
    })
  })

  describe('softDeleteCommentById method', () => {
    it('should call verifyCommentAccess method', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      const spyVerifyCommentAccessMethod = jest.spyOn(repo, 'verifyCommentAccess')

      await ThreadCommentsTableHelper.addCommentToThread({ commentId: 'comment-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteCommentById('comment-123', dummyUser.id)

      // Assert
      expect(spyVerifyCommentAccessMethod).toBeCalledWith(
        'comment-123', dummyUser.id
      )
    })

    it('should update the comment delete status', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      await ThreadCommentsTableHelper.addCommentToThread({ commentId: 'comment-123', owner: dummyUser.id })

      // Action
      await repo.softDeleteCommentById('comment-123', dummyUser.id)

      // Assert
      const [comment] = await ThreadCommentsTableHelper.findCommentById('comment-123')

      expect(comment.is_deleted).toEqual(true)
    })
  })

  describe('getCommentsFromThread method', () => {
    it('should return empty array if no comment are found', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      // Action
      const comments = await repo.getCommentsFromThread(dummyThread.id)

      // Assert
      expect(comments).toEqual([])
    })

    it('should return array of comments with expected comment value', async () => {
      // Arrange
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      await ThreadCommentsTableHelper.addCommentToThread({
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
      const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

      await ThreadCommentsTableHelper.addCommentToThread({
        commentId: 'comment-123',
        content: 'A comment',
        owner: dummyUser.id
      })
      await ThreadCommentsTableHelper.addCommentToThread({
        commentId: 'comment-xyz',
        content: 'A comment',
        owner: dummyUser2.id
      })

      await ThreadCommentsTableHelper.softDeleteComment('comment-xyz')

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
    const repo = new ThreadCommentsRepoImpl(pool, fakeIdGen)

    it('should throw HttpError [404 Not Found] if the comment is not found', async () => {
      // Action & Assert
      await expect(repo.verifyCommentLocation('comment-123', dummyThread.id))
        .rejects.toThrowError(HttpError.notFound('komentar tidak ditemukan'))
    })

    it('should throw HttpError [404 Not Found] if the comment is invalid', async () => {
      // Arrange
      await ThreadCommentsTableHelper.addCommentToThread({})

      // Action & Assert
      await expect(repo.verifyCommentLocation('comment-123', 'thread-xyz'))
        .rejects.toThrowError(HttpError.notFound('komentar tidak ditemukan pada thread ini'))
    })

    it('should not throw HttpError [404 Not Found] if the comment is valid', async () => {
      // Arrange
      await ThreadCommentsTableHelper.addCommentToThread({})

      // Action & Assert
      await expect(repo.verifyCommentLocation('comment-123', dummyThread.id))
        .resolves.not.toThrowError(HttpError.notFound('ko'))
    })
  })
})

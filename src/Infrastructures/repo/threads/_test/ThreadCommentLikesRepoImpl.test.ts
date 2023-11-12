// ./src/
import pool from '../../../../infrastructures/db/psql/pool'

// ./src/infrastructures/repo/threads/
import ThreadCommentLikesRepoImpl from '../ThreadCommentLikesRepoImpl'

// ./tests/
import UsersTableHelper from '../../../../../tests/helpers/UsersTableHelper'
import ThreadsTableHelper from '../../../../../tests/helpers/ThreadsTableHelper'
import ThreadCommentsTableHelper from '../../../../../tests/helpers/ThreadCommentsTableHelper'
import ThreadCommentLikesTableHelper from '../../../../../tests/helpers/ThreadCommentLikesTableHelper'

describe('ThreadCommentLikesRepoImpl', () => {
  const dummyUser = {
    id: 'user-123',
    username: 'dicoding'
  }
  const dummyThread = {
    id: 'thread-123',
    owner: 'user-123'
  }
  const dummyComment = {
    commentId: 'comment-123',
    threadId: 'thread-123',
    owner: dummyUser.id
  }

  const fakeIdGen = (): string => '123'

  beforeAll(async () => {
    await UsersTableHelper.addUser({ ...dummyUser })
    await ThreadsTableHelper.addThread({ ...dummyThread })
    await ThreadCommentsTableHelper.addCommentToThread({ ...dummyComment })
  })

  afterEach(async () => {
    await ThreadCommentLikesTableHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableHelper.cleanTable()
    await pool.end()
  })

  describe('likeAComment method', () => {
    it('should presist like comment data', async () => {
      // Arrange
      const repo = new ThreadCommentLikesRepoImpl(pool, fakeIdGen)

      // Action
      await repo.likeAComment(dummyComment.commentId, dummyUser.id)

      // Assert
      const [likeData] = await ThreadCommentLikesTableHelper.getCommentLike('comment-like-123')

      expect(likeData.commentId).toStrictEqual(dummyComment.commentId)
      expect(likeData.liker).toStrictEqual(dummyUser.id)
    })
  })

  describe('dislikeAComment method', () => {
    it('should delete like comment data from database', async () => {
      // Arrange
      await ThreadCommentLikesTableHelper.likeAComment({
        commentId: dummyComment.commentId,
        liker: dummyUser.id
      })

      const repo = new ThreadCommentLikesRepoImpl(pool, fakeIdGen)

      // Action
      await repo.dislikeAComment(dummyComment.commentId, dummyUser.id)

      // Assert
      const likeDatas = await ThreadCommentLikesTableHelper.getCommentLike('comment-like-123')

      expect(likeDatas.length).toStrictEqual(0)
    })
  })

  describe('verifyCommentLike method', () => {
    it('should return false if the like comment data does not exist', async () => {
      // Arrange
      const repo = new ThreadCommentLikesRepoImpl(pool, fakeIdGen)

      // Action
      const isLiked = await repo.verifyCommentLike(dummyComment.commentId, dummyUser.id)

      // Assert
      expect(isLiked).toStrictEqual(false)
    })

    it('should return true if the like comment data exists', async () => {
      // Arrange
      await ThreadCommentLikesTableHelper.likeAComment({
        commentId: dummyComment.commentId,
        liker: dummyUser.id
      })

      const repo = new ThreadCommentLikesRepoImpl(pool, fakeIdGen)

      // Action
      const isLiked = await repo.verifyCommentLike(dummyComment.commentId, dummyUser.id)

      // Assert
      expect(isLiked).toStrictEqual(true)
    })
  })
})

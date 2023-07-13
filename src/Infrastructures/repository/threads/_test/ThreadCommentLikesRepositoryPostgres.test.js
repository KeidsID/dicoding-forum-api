const pool = require('../../../database/postgres/pool')

const ThreadCommentLikesRepositoryPostgres = require('../ThreadCommentLikesRepositoryPostgres')

const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentLikesTableTestHelper = require('../../../../../tests/ThreadCommentLikesTableTestHelper')

describe('ThreadCommentLikesRepositoryPostgres', () => {
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

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ ...dummyUser })
    await ThreadsTableTestHelper.addThread({ ...dummyThread })
    await ThreadCommentsTableTestHelper.addCommentToThread({ ...dummyComment })
  })

  afterEach(async () => {
    await ThreadCommentLikesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('likeAComment method', () => {
    it('should presist like comment data', async () => {
      // Arrange
      const fakeIdGen = () => '123'

      const repo = new ThreadCommentLikesRepositoryPostgres(pool, fakeIdGen)

      // Action
      await repo.likeAComment(dummyComment.commentId, dummyUser.id)

      // Assert
      const [likeData] = await ThreadCommentLikesTableTestHelper.getCommentLike('comment-like-123')

      expect(likeData.commentId).toStrictEqual(dummyComment.commentId)
      expect(likeData.liker).toStrictEqual(dummyUser.id)
    })
  })

  describe('dislikeAComment method', () => {
    it('should delete like comment data from database', async () => {
      // Arrange
      await ThreadCommentLikesTableTestHelper.likeAComment(dummyComment.commentId, dummyUser.id)

      const repo = new ThreadCommentLikesRepositoryPostgres(pool, {})

      // Action
      await repo.dislikeAComment(dummyComment.commentId, dummyUser.id)

      // Assert
      const likeDatas = await ThreadCommentLikesTableTestHelper.getCommentLike('comment-like-123')

      expect(likeDatas.length).toStrictEqual(0)
    })
  })

  describe('verifyCommentLike method', () => {
    it('should return false if the like comment data does not exist', async () => {
      // Arrange
      const repo = new ThreadCommentLikesRepositoryPostgres(pool, {})

      // Action
      const isLiked = await repo.verifyCommentLike(dummyComment.commentId, dummyUser.id)

      // Assert
      expect(isLiked).toStrictEqual(false)
    })

    it('should return true if the like comment data exists', async () => {
      // Arrange
      await ThreadCommentLikesTableTestHelper.likeAComment(dummyComment.commentId, dummyUser.id)

      const repo = new ThreadCommentLikesRepositoryPostgres(pool, {})

      // Action
      const isLiked = await repo.verifyCommentLike(dummyComment.commentId, dummyUser.id)

      // Assert
      expect(isLiked).toStrictEqual(true)
    })
  })
})

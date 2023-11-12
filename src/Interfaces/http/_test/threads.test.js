const pool = require('../../database/postgres/pool')

const ServerTestHelper = require('../../../../tests/ServerTestHelper')

const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper')

const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  const dummyUser = {
    id: 'user-123',
    username: 'dicoding'
  }
  const dummyUser2 = {
    id: 'user-xyz',
    username: 'fulan'
  }

  describe('when POST /threads', () => {
    it('should respond 201 status code and added thread', async () => {
      // Arrange
      const reqPayload = {
        title: 'A thread',
        body: 'A thread body'
      }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
      expect(responseJson.data.addedThread.id).toBeDefined()
      expect(responseJson.data.addedThread.title).toBeDefined()
      expect(responseJson.data.addedThread.owner).toBeDefined()
    })

    it('should respond 400 status code when request a bad payload', async () => {
      // Arrange
      const reqPayload = {
        title: 'A thread',
        body: 123
      }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tipe data pada thread tidak valid')
    })

    it('should respond 401 status code when the request does not have an authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST', url: '/threads'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toBeDefined()
      expect(responseJson.message).toEqual('Missing authentication')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should respond 404 status code when the thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should respond 200 with valid thread structures (contain valid comments and replies)', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      await UsersTableTestHelper.addUser(dummyUser2)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })

      await ThreadCommentsTableTestHelper.addCommentToThread({
        commentId: 'comment-123',
        threadId: 'thread-123',
        content: `komentar dari ${dummyUser.username}`,
        owner: dummyUser.id
      })
      await ThreadCommentsTableTestHelper.addCommentToThread({
        commentId: 'comment-xyz',
        threadId: 'thread-123',
        content: `komentar dari ${dummyUser2.username}`,
        owner: dummyUser2.id
      })
      await ThreadCommentsTableTestHelper.softDeleteComment('comment-xyz')

      await ThreadCommentRepliesTableTestHelper.addReplyToComment({
        replyId: 'reply-123',
        commentId: 'comment-123',
        content: `balasan dari ${dummyUser.username}`,
        owner: dummyUser.id
      })
      await ThreadCommentRepliesTableTestHelper.addReplyToComment({
        replyId: 'reply-xyz',
        commentId: 'comment-123',
        content: `balasan dari ${dummyUser2.username}`,
        owner: dummyUser2.id
      })

      await ThreadCommentRepliesTableTestHelper.softDeleteReply('reply-xyz')

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toStrictEqual(200)
      expect(responseJson.status).toStrictEqual('success')

      const thread = responseJson.data.thread

      expect(thread.id).toStrictEqual('thread-123')
      expect(thread.title).toStrictEqual('sebuah thread')
      expect(thread.body).toStrictEqual('sebuah body thread')
      expect(new Date(thread.date).getDate()).toStrictEqual(new Date().getDate())
      expect(thread.username).toStrictEqual(dummyUser.username)

      const [dummyUserComment, dummyUser2Comment] = thread.comments

      expect(dummyUserComment.id).toStrictEqual('comment-123')
      expect(dummyUserComment.username).toStrictEqual(dummyUser.username)
      expect(new Date(dummyUserComment.date).getDate()).toStrictEqual(new Date().getDate())
      expect(dummyUserComment.content).toStrictEqual(`komentar dari ${dummyUser.username}`)

      expect(dummyUser2Comment.id).toStrictEqual('comment-xyz')
      expect(dummyUser2Comment.username).toStrictEqual(dummyUser2.username)
      expect(new Date(dummyUser2Comment.date).getDate()).toStrictEqual(new Date().getDate())
      expect(dummyUser2Comment.content).toStrictEqual('**komentar telah dihapus**')

      const [dummyUserReply, dummyUser2Reply] = dummyUserComment.replies

      expect(dummyUserReply.id).toStrictEqual('reply-123')
      expect(dummyUserReply.username).toStrictEqual(dummyUser.username)
      expect(new Date(dummyUserReply.date).getDate()).toStrictEqual(new Date().getDate())
      expect(dummyUserReply.content).toStrictEqual(`balasan dari ${dummyUser.username}`)

      expect(dummyUser2Reply.id).toStrictEqual('reply-xyz')
      expect(dummyUser2Reply.username).toStrictEqual(dummyUser2.username)
      expect(new Date(dummyUser2Reply.date).getDate()).toStrictEqual(new Date().getDate())
      expect(dummyUser2Reply.content).toStrictEqual('**balasan telah dihapus**')
    })
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should respond 401 status code when the request does not have an authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST', url: '/threads/thread-123/comments'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toBeDefined()
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should respond 400 status code when request a bad payload', async () => {
      // Arrange
      const reqPayload = { content: 400 }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tipe data pada comment tidak valid')
    })

    it('should respond 404 status code when the thread is not found', async () => {
      // Arrange
      const reqPayload = { content: 'A comment' }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should respond 201 status code and added comment ', async () => {
      // Arrange
      const reqPayload = { content: 'A comment' }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.id).toBeDefined()
      expect(responseJson.data.addedComment.content).toBeDefined()
      expect(responseJson.data.addedComment.owner).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond 401 status code when the request does not have an authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE', url: '/threads/thread-123/comments/comment-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toBeDefined()
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should respond 404 status code when the thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan')
    })

    it('should respond 403 status code when user is not the comment owner ', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      await UsersTableTestHelper.addUser(dummyUser2)

      const accessToken = await ServerTestHelper.login(dummyUser2)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })
      await ThreadCommentsTableTestHelper.addCommentToThread({
        threadId: 'thread-123', commentId: 'comment-123', owner: dummyUser.id
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('anda tidak dapat mengakses komentar orang lain')
    })

    it('should respond 200 status code ', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)

      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })
      await ThreadCommentsTableTestHelper.addCommentToThread({
        threadId: 'thread-123', commentId: 'comment-123', owner: dummyUser.id
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    const validTestUrl = '/threads/thread-123/comments/comment-123/likes'

    it('should respond 404 status code when the thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({})

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found ON THE THREAD', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({}) // thread-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-xyz' })
      await ThreadCommentsTableTestHelper.addCommentToThread({}) // comment-123 on thread-123

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-xyz/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan pada thread ini')
    })

    it(
      'should respond 200 status code when comment is liked and the comment like count on thread detail endpoint increased',
      async () => {
        // Arrange
        const server = await createServer(container)

        await UsersTableTestHelper.addUser(dummyUser)
        const accessToken = await ServerTestHelper.login(dummyUser)

        await ThreadsTableTestHelper.addThread({}) // thread-123
        await ThreadCommentsTableTestHelper.addCommentToThread({}) // comment-123 on thread-123

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: validTestUrl,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        // Assert
        const responseJson = JSON.parse(response.payload)

        expect(response.statusCode).toEqual(200)
        expect(responseJson.status).toEqual('success')

        const threadDetailResponse = await server.inject({
          method: 'GET',
          url: '/threads/thread-123'
        })
        const threadDetailResponseJson = JSON.parse(threadDetailResponse.payload)

        const thread = threadDetailResponseJson.data.thread
        const comments = thread.comments

        expect(comments[0].likeCount).toStrictEqual(1)
      }
    )
  })

  describe('when POST /threads/{threadId}/comments/{commentID}/replies', () => {
    const validTestUrl = '/threads/thread-123/comments/comment-123/replies'

    it('should respond 401 status code when the request does not have an authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST', url: validTestUrl
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toBeDefined()
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should respond 400 status code when request a bad payload', async () => {
      // Arrange
      const reqPayload = { content: 400 }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tipe data pada balasan tidak valid')
    })

    it('should respond 404 status code when the thread is not found', async () => {
      // Arrange
      const reqPayload = { content: 'A Reply' }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found', async () => {
      // Arrange
      const reqPayload = { content: 'A Reply' }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found ON THE THREAD', async () => {
      // Arrange
      const reqPayload = { content: 'A Reply' }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({}) // thread-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-xyz' })
      await ThreadCommentsTableTestHelper.addCommentToThread({}) // comment-123 on thread-123

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xyz/comments/comment-123/replies',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan pada thread ini')
    })

    it('should respond 201 status code and added reply', async () => {
      // Arrange
      const reqPayload = { content: 'A Reply' }
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({}) // thread-123
      await ThreadCommentsTableTestHelper.addCommentToThread({}) // comment-123 on thread-123

      // Action
      const response = await server.inject({
        method: 'POST',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        payload: reqPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
      expect(responseJson.data.addedReply.id).toBeDefined()
      expect(responseJson.data.addedReply.content).toBeDefined()
      expect(responseJson.data.addedReply.owner).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    const validTestUrl = '/threads/thread-123/comments/comment-123/replies/reply-123'

    it('should respond 401 status code when the request does not have an authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE', url: validTestUrl
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toBeDefined()
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should respond 404 status code when the thread is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan')
    })

    it('should respond 404 status code when the comment is not found ON THE THREAD', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser) // user-123
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({}) // thread-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-xyz' })
      await ThreadCommentsTableTestHelper.addCommentToThread({}) // comment-123 on thread-123

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xyz/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('komentar tidak ditemukan pada thread ini')
    })

    it('should respond 200 status code', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser) // user-123
      const accessToken = await ServerTestHelper.login(dummyUser)

      await ThreadsTableTestHelper.addThread({}) // thread-123
      await ThreadCommentsTableTestHelper.addCommentToThread({}) // comment-123 on thread-123
      await ThreadCommentRepliesTableTestHelper.addReplyToComment({}) // reply-123 on comment-123

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: validTestUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})

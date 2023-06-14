const pool = require('../../database/postgres/pool')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

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

    it('should respond 200 with valid thread structures (contain valid comment)', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser(dummyUser)
      await UsersTableTestHelper.addUser(dummyUser2)

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: dummyUser.id })

      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: 'comment-123',
        threadId: 'thread-123',
        content: `komentar dari ${dummyUser.username}`,
        owner: dummyUser.id
      })
      await ThreadCommentsTableTestHelper.addCommentToThread({
        id: 'comment-xyz',
        threadId: 'thread-123',
        content: `komentar dari ${dummyUser2.username}`,
        owner: dummyUser2.id
      })
      await ThreadCommentsTableTestHelper.softDeleteComment('comment-xyz')

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('success')

      const thread = responseJson.data.thread

      expect(thread.id).toEqual('thread-123')
      expect(thread.title).toEqual('sebuah thread')
      expect(thread.body).toEqual('sebuag body thread')
      expect(thread.date.getMinutes()).toEqual(new Date().getMinutes())
      expect(thread.username).toEqual(dummyUser.username)

      const [dummyUserComment, dummyUser2Comment] = thread.comments

      expect(dummyUserComment.id).toEqual('comment-123')
      expect(dummyUserComment.username).toEqual(dummyUser.username)
      expect(dummyUserComment.date.getMinutes()).toEqual(new Date().getMinutes())
      expect(dummyUserComment.content).toEqual(`komentar dari ${dummyUser.username}`)

      expect(dummyUser2Comment.id).toEqual('comment-xyz')
      expect(dummyUser2Comment.username).toEqual(dummyUser2.username)
      expect(dummyUser2Comment.date.getMinutes()).toEqual(new Date().getMinutes())
      expect(dummyUser2Comment.content).toEqual('**komentar telah dihapus**')
    })
  })
})

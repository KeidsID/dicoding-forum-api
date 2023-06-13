const pool = require('../../database/postgres/pool')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
// const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
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

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
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

    it('should response 400 when request a bad payload', async () => {
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

    it('responds 401 when the request does not have authentication', async () => {
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
      expect(responseJson.message).toBeDefined()
    })
  })
})

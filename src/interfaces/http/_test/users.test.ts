// ./src/
import bottle, { initBottle } from '../../../infrastructures/bottle/index'
import pool from '../../../infrastructures/db/psql/pool'

// ./src/interfaces/
import createServer from '../createServer'

// ./tests/
import UsersTableHelper from '../../../../tests/helpers/UsersTableHelper'

describe('/users endpoint', () => {
  beforeAll(() => {
    initBottle()
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableHelper.cleanTable()
  })

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secretpass',
        fullname: 'Dicoding Indonesia'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedUser).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secretpass',
        fullname: ['Dicoding Indonesia']
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secretpass',
        fullname: 'Dicoding Indonesia'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secretpass',
        fullname: 'Dicoding Indonesia'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableHelper.addUser({ username: 'dicoding' })
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(message).toEqual('username tidak tersedia')
    })
  })
})

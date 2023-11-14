// ./src/
import type AuthTokenManager from '../../../core/security/AuthTokenManager'
import bottle, { initBottle } from '../../../infrastructures/bottle/index'
import pool from '../../../infrastructures/db/psql/pool'

// ./src/interfaces/http/
import createServer from '../createServer'

// ./tests/
import UsersTableHelper from '../../../../tests/helpers/UsersTableHelper'
import AuthenticationsTableHelper from '../../../../tests/helpers/AuthenticationsTableHelper'

describe('/authentications endpoint', () => {
  beforeAll(() => {
    initBottle()
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableHelper.cleanTable()
    await AuthenticationsTableHelper.cleanTable()
  })

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secretpass'
      }
      const server = await createServer(bottle)
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secretpass',
          fullname: 'Dicoding Indonesia'
        }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
    })

    it('should response 400 if username not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secretpass'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak ditemukan')
    })

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password'
      }
      const server = await createServer(bottle)
      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secretpass',
          fullname: 'Dicoding Indonesia'
        }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      console.log(responseJson)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah')
    })

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 123,
        password: 'secret'
      }
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })
  })

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = await createServer(bottle)
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secretpass',
          fullname: 'Dicoding Indonesia'
        }
      })
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secretpass'
        }
      })
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
    })

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {}
      })

      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      })

      const { status, message } = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should return 400 if refresh token not valid', async () => {
      // Arrange
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalid_refresh_token'
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak valid')
    })

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(bottle)
      const refreshToken = await (bottle.container.AuthTokenManager as AuthTokenManager)
        .createRefreshToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database')
    })
  })

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const server = await createServer(bottle)
      const refreshToken = 'refresh_token'
      await AuthenticationsTableHelper.addToken(refreshToken)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const server = await createServer(bottle)
      const refreshToken = 'refresh_token'

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database')
    })

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {}
      })

      const { status, message } = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(bottle)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      })

      const { status, message } = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(status).toEqual('fail')
      expect(typeof message).toBe('string')
    })
  })
})

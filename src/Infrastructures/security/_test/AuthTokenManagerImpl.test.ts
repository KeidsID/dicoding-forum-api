import { type token } from '@hapi/jwt'
import { mock } from 'ts-jest-mocker'

// ./src/
import * as Configs from '../../../common/env/index'
import HttpError from '../../../common/error/HttpError'

// ./src/infrastructures/security/
import AuthTokenManagerImpl from '../AuthTokenManagerImpl'

type HapiJwtToken = typeof token

describe('AuthTokenManagerImpl', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding'
      }

      const mockJwtToken = mock<HapiJwtToken>()

      mockJwtToken.generate = jest.fn().mockImplementation(() => 'mock_token')

      const jwtTokenManager = new AuthTokenManagerImpl(mockJwtToken)

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, Configs.jwt.accessTokenKey)
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding'
      }

      const mockJwtToken = mock<HapiJwtToken>()

      mockJwtToken.generate = jest.fn().mockImplementation(() => 'mock_token')

      const jwtTokenManager = new AuthTokenManagerImpl(mockJwtToken)

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, Configs.jwt.refreshTokenKey)
      expect(refreshToken).toEqual('mock_token')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw HttpError [400 Bad Request] when verification failed', async () => {
      // Arrange
      const mockHapiJwtToken = mock<HapiJwtToken>()

      mockHapiJwtToken.verify = jest.fn().mockImplementation(() => { throw new Error() })

      const jwtTokenManager = new AuthTokenManagerImpl(mockHapiJwtToken)

      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects
        .toThrow(HttpError.badRequest('refresh token tidak valid'))
    })

    it('should not throw HttpError [400 Bad Request] when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new AuthTokenManagerImpl(mock<HapiJwtToken>())

      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not
        .toThrow(HttpError.badRequest('refresh token tidak valid'))
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const mockHapiJwtToken = mock<HapiJwtToken>()

      mockHapiJwtToken.decode = jest.fn().mockImplementation(() => ({
        decoded: { payload: { username: 'dicoding' } }
      }))

      const jwtTokenManager = new AuthTokenManagerImpl(mockHapiJwtToken)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken)

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding')
    })
  })
})

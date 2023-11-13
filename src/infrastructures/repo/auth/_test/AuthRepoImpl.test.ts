// ./src/
import HttpError from '../../../../common/error/HttpError'
import pool from '../../../../infrastructures/db/psql/pool'

// ./tests/
import AuthenticationsTableHelper from '../../../../../tests/helpers/AuthenticationsTableHelper'

import AuthRepoImpl from '../AuthRepoImpl'

describe('AuthRepoImpl', () => {
  afterEach(async () => {
    await AuthenticationsTableHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new AuthRepoImpl(pool)
      const token = 'token'

      // Action
      await authenticationRepository.addToken(token)

      // Assert
      const tokens = await AuthenticationsTableHelper.findToken(token)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toBe(token)
    })
  })

  describe('verifyToken function', () => {
    const expectedError = HttpError.badRequest('refresh token tidak ditemukan di database')

    it('should throw HttpError [400 Bad Request] if token not available', async () => {
      // Arrange
      const authenticationRepository = new AuthRepoImpl(pool)
      const token = 'token'

      // Action & Assert
      await expect(authenticationRepository.verifyToken(token)).rejects
        .toThrow(expectedError)
    })

    it('should not throw HttpError [400 Bad Request] if token available', async () => {
      // Arrange
      const authenticationRepository = new AuthRepoImpl(pool)
      const token = 'token'
      await AuthenticationsTableHelper.addToken(token)

      // Action & Assert
      await expect(authenticationRepository.verifyToken(token))
        .resolves.not.toThrow(expectedError)
    })
  })

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new AuthRepoImpl(pool)
      const token = 'token'
      await AuthenticationsTableHelper.addToken(token)

      // Action
      await authenticationRepository.deleteToken(token)

      // Assert
      const tokens = await AuthenticationsTableHelper.findToken(token)
      expect(tokens).toHaveLength(0)
    })
  })
})

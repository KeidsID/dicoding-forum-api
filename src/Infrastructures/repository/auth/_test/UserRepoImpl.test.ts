import HttpError from 'src/common/error/HttpError'
import type RegisterUser from 'src/core/entities/auth/RegisterUser'
import type RegisteredUser from 'src/core/entities/auth/RegisteredUser'
import pool from 'src/infrastructures/db/psql/pool'

import UsersTableHelper from 'tests/helpers/UsersTableHelper'

import UserRepoImpl from '../UserRepoImpl'

describe('UserRepoImpl', () => {
  afterEach(async () => {
    await UsersTableHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyUsernameAvailability function', () => {
    const expectedError = HttpError.badRequest('username tidak tersedia')

    it('should throw HttpError [400 Bad Request] when username not available', async () => {
      // Arrange
      await UsersTableHelper.addUser({ username: 'dicoding' }) // memasukan user baru dengan username dicoding
      const subject = new UserRepoImpl(pool, () => '')

      // Action & Assert
      await expect(subject.verifyUsernameAvailability('dicoding')).rejects
        .toThrowError(expectedError)
    })

    it('should not throw HttpError [400 Bad Request] when username available', async () => {
      // Arrange
      const subject = new UserRepoImpl(pool, () => '')

      // Action & Assert
      await expect(subject.verifyUsernameAvailability('dicoding')).resolves.not
        .toThrowError(expectedError)
    })
  })

  describe('addUser function', () => {
    const fakeIdGenerator: () => string = () => '123' // stub

    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser: RegisterUser = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      }
      const subject = new UserRepoImpl(pool, fakeIdGenerator)

      // Action
      await subject.addUser(registerUser)

      // Assert
      const users = await UsersTableHelper.findUsersById('user-123')
      expect(users).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser: RegisterUser = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      }
      const subject = new UserRepoImpl(pool, fakeIdGenerator)

      // Action
      const registeredUser = await subject.addUser(registerUser)

      // Assert
      expect(registeredUser).toStrictEqual({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia'
      } satisfies RegisteredUser)
    })
  })

  describe('getPasswordByUsername', () => {
    it('should throw HttpError [400 Bad Request] when user not found', async () => {
      // Arrange
      const subject = new UserRepoImpl(pool, () => '')

      // Action & Assert
      await expect(subject.getPasswordByUsername('dicoding')).rejects
        .toThrowError(HttpError.badRequest('username tidak ditemukan'))
    })

    it('should return username password when user is found', async () => {
      // Arrange
      const subject = new UserRepoImpl(pool, () => '')
      await UsersTableHelper.addUser({
        username: 'dicoding',
        password: 'secret_password'
      })

      // Action & Assert
      const password = await subject.getPasswordByUsername('dicoding')
      expect(password).toBe('secret_password')
    })
  })

  describe('getIdByUsername', () => {
    it('should throw HttpError [400 Bad Request] when user not found', async () => {
      // Arrange
      const subject = new UserRepoImpl(pool, () => '')

      // Action & Assert
      await expect(subject.getIdByUsername('dicoding'))
        .rejects
        .toThrowError(HttpError.badRequest('user tidak ditemukan'))
    })

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableHelper.addUser({ id: 'user-321', username: 'dicoding' })
      const subject = new UserRepoImpl(pool, () => '')

      // Action
      const userId = await subject.getIdByUsername('dicoding')

      // Assert
      expect(userId).toEqual('user-321')
    })
  })
})

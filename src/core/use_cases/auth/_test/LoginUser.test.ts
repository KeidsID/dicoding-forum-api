import { mock } from 'ts-jest-mocker'

import type NewAuth from 'src/core/entities/auth/NewAuth'
import type UserLogin from 'src/core/entities/auth/UserLogin'
import type AuthRepo from 'src/core/repo/auth/AuthRepo'
import type UserRepo from 'src/core/repo/auth/UserRepo'
import type AuthTokenManager from 'src/core/security/AuthTokenManager'
import type PasswordHasher from 'src/core/security/PasswordHasher'

import LoginUser from '../LoginUser'

describe('LoginUser use case', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload: UserLogin = {
      username: 'dicoding',
      password: 'secret'
    }

    const mockedAuthentication: NewAuth = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    }

    const mockAuthRepo = mock<AuthRepo>()
    const mockUserRepo = mock<UserRepo>()
    const mockAuthTokenManager = mock<AuthTokenManager>()
    const mockPasswordHasher = mock<PasswordHasher>()

    // Mocking
    mockAuthRepo.addToken = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockUserRepo.getPasswordByUsername = jest.fn()
      .mockImplementation(async () => await Promise.resolve('encrypted_password'))
    mockPasswordHasher.verifyPassword = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockAuthTokenManager.createAccessToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockedAuthentication.accessToken))
    mockAuthTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve(mockedAuthentication.refreshToken))
    mockUserRepo.getIdByUsername = jest.fn()
      .mockImplementation(async () => await Promise.resolve('user-123'))

    // create use case instance
    const subject = new LoginUser({
      authRepo: mockAuthRepo,
      userRepo: mockUserRepo,
      authTokenManager: mockAuthTokenManager,
      passwordHasher: mockPasswordHasher
    })

    // Action
    const actualAuthentication = await subject.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    expect(mockUserRepo.getPasswordByUsername)
      .toBeCalledWith('dicoding')
    expect(mockPasswordHasher.verifyPassword)
      .toBeCalledWith('secret', 'encrypted_password')
    expect(mockUserRepo.getIdByUsername)
      .toBeCalledWith('dicoding')
    expect(mockAuthTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(mockAuthTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(mockAuthRepo.addToken)
      .toBeCalledWith(mockedAuthentication.refreshToken)
  })
})

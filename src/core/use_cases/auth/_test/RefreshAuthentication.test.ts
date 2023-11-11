import { mock } from 'ts-jest-mocker'

import type AuthRepo from 'src/core/repo/auth/AuthRepo'
import type AuthTokenManager from 'src/core/security/AuthTokenManager'

import RefreshAuthentication from '../RefreshAuthentication'

describe('RefreshAuthentication usecase', () => {
  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token'
    }
    const mockAuthRepo = mock<AuthRepo>()
    const mockAuthTokenManager = mock<AuthTokenManager>()
    // Mocking
    mockAuthRepo.verifyToken = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockAuthTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockAuthTokenManager.decodePayload = jest.fn()
      .mockImplementation(async () => await Promise.resolve({ username: 'dicoding', id: 'user-123' }))
    mockAuthTokenManager.createAccessToken = jest.fn()
      .mockImplementation(async () => await Promise.resolve('some_new_access_token'))
    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthentication({
      authRepo: mockAuthRepo,
      authTokenManager: mockAuthTokenManager
    })

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthTokenManager.verifyRefreshToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepo.verifyToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthTokenManager.decodePayload)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(accessToken).toEqual('some_new_access_token')
  })
})

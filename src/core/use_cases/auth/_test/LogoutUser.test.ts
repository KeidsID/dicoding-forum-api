import { mock } from 'ts-jest-mocker'

import type AuthRepo from 'src/core/repo/auth/AuthRepo'

import LogoutUser from '../LogoutUser'

describe('LogoutUser', () => {
  it('should orchestrating the logout action correctly', async () => {
    // Arrange
    const useCasePayload = { refreshToken: 'refreshToken' }

    const mockAuthRepo = mock<AuthRepo>()

    mockAuthRepo.verifyToken = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockAuthRepo.deleteToken = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    const subject = new LogoutUser({ authRepo: mockAuthRepo })

    // Act
    await subject.execute(useCasePayload)

    // Assert
    expect(mockAuthRepo.verifyToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepo.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})

import { mock } from 'ts-jest-mocker'

// ./src/core/
import type AuthRepo from '../../../repo/auth/AuthRepo'

import DeleteAuthentication from '../DeleteAuthentication'

describe('DeleteAuthentication usecase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }

    const mockAuthRepo = mock<AuthRepo>()

    mockAuthRepo.verifyToken = jest.fn().mockImplementation(async () => {
      await Promise.resolve()
    })

    mockAuthRepo.deleteToken = jest.fn().mockImplementation(async () => {
      await Promise.resolve()
    })

    const deleteAuthenticationUseCase = new DeleteAuthentication({
      authRepo: mockAuthRepo
    })

    // Act
    await deleteAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthRepo.verifyToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepo.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})

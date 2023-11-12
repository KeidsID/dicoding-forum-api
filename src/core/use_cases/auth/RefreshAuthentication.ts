// ./../../
import type AuthRepo from '../../repo/auth/AuthRepo'
import type AuthTokenManager from '../../security/AuthTokenManager'

export default class RefreshAuthentication {
  private readonly _authRepo: AuthRepo
  private readonly _authTokenManager: AuthTokenManager

  constructor (services: {
    authRepo: AuthRepo
    authTokenManager: AuthTokenManager
  }) {
    const { authRepo, authTokenManager } = services

    this._authRepo = authRepo
    this._authTokenManager = authTokenManager
  }

  async execute (args: { refreshToken: string }): Promise<string> {
    const { refreshToken } = args

    await this._authTokenManager.verifyRefreshToken(refreshToken)
    await this._authRepo.verifyToken(refreshToken)

    const oldPayload = await this._authTokenManager.decodePayload(refreshToken)

    return await this._authTokenManager.createAccessToken(oldPayload)
  }
}

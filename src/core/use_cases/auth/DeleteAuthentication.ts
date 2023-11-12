// ./src/core/
import type AuthRepo from '../../repo/auth/AuthRepo'

export default class DeleteAuthentication {
  private readonly _authRepo: AuthRepo

  constructor (services: {
    authRepo: AuthRepo
  }) {
    this._authRepo = services.authRepo
  }

  async execute (args: { refreshToken: string }): Promise<void> {
    const { refreshToken } = args

    await this._authRepo.verifyToken(refreshToken)
    await this._authRepo.deleteToken(refreshToken)
  }
}

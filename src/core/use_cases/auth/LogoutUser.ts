import type AuthRepo from '../../repo/auth/AuthRepo'

export default class LogoutUser {
  private readonly _authRepo: AuthRepo

  constructor (services: { authRepo: AuthRepo }) {
    const { authRepo } = services

    this._authRepo = authRepo
  }

  async execute (args: { refreshToken: string }): Promise<void> {
    const { refreshToken } = args

    await this._authRepo.verifyToken(refreshToken)
    await this._authRepo.deleteToken(refreshToken)
  }
}

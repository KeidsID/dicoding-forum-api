import type AuthRepo from 'src/core/repo/auth/AuthRepo'

export default class DeleteAuthentication {
  private readonly _authenticationRepository: AuthRepo

  constructor (services: {
    authRepo: AuthRepo
  }) {
    this._authenticationRepository = services.authRepo
  }

  async execute (args: { refreshToken: string }): Promise<void> {
    const { refreshToken } = args

    await this._authenticationRepository.verifyToken(refreshToken)
    await this._authenticationRepository.deleteToken(refreshToken)
  }
}

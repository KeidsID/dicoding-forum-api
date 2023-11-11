import type NewAuth from 'src/core/entities/auth/NewAuth'
import type UserLogin from 'src/core/entities/auth/UserLogin'
import type AuthRepo from 'src/core/repo/auth/AuthRepo'
import type UserRepo from 'src/core/repo/auth/UserRepo'
import type AuthTokenManager from 'src/core/security/AuthTokenManager'
import type PasswordHasher from 'src/core/security/PasswordHasher'

export default class LoginUser {
  private readonly _userRepo: UserRepo
  private readonly _authRepo: AuthRepo
  private readonly _authTokenManager: AuthTokenManager
  private readonly _passwordHasher: PasswordHasher
  constructor (services: {
    authRepo: AuthRepo
    userRepo: UserRepo
    authTokenManager: AuthTokenManager
    passwordHasher: PasswordHasher
  }) {
    const {
      authRepo, userRepo,
      authTokenManager, passwordHasher
    } = services

    this._authRepo = authRepo
    this._userRepo = userRepo
    this._authTokenManager = authTokenManager
    this._passwordHasher = passwordHasher
  }

  async execute (args: UserLogin): Promise<NewAuth> {
    const { username, password } = args

    const encryptedPassword = await this._userRepo.getPasswordByUsername(username)

    await this._passwordHasher.verifyPassword(password, encryptedPassword)

    const id = await this._userRepo.getIdByUsername(username)

    const accessToken = await this._authTokenManager.createAccessToken({
      username, id
    })
    const refreshToken = await this._authTokenManager.createRefreshToken({
      username, id
    })

    const newAuth: NewAuth = {
      accessToken,
      refreshToken
    }

    await this._authRepo.addToken(newAuth.refreshToken)

    return newAuth
  }
}

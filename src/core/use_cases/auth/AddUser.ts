import type UserRepo from 'src/core/repo/auth/UserRepo'
import type PasswordHasher from 'src/core/security/PasswordHasher'

import type RegisteredUser from 'src/core/entities/auth/RegisteredUser'
import type RegisterUser from 'src/core/entities/auth/RegisterUser'

export default class AddUser {
  private readonly _userRepo: UserRepo
  private readonly _passwordHash: PasswordHasher

  constructor (services: {
    userRepo: UserRepo
    passwordHasher: PasswordHasher
  }) {
    this._userRepo = services.userRepo
    this._passwordHash = services.passwordHasher
  }

  async execute (credentials: RegisterUser): Promise<RegisteredUser> {
    await this._userRepo.verifyUsernameAvailability(credentials.username)

    const encryptedPass = await this._passwordHash.hash(credentials.password)

    return await this._userRepo.addUser({
      ...credentials,
      password: encryptedPass
    })
  }
}

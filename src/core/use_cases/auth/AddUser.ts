import type UserRepo from 'src/core/repo/auth/UserRepo'
import type PasswordHasher from 'src/core/security/PasswordHasher'

import type RegisteredUser from 'src/core/entities/auth/RegisteredUser'
import type RegisterUser from 'src/core/entities/auth/RegisterUser'

export default class AddUser {
  private readonly _userRepository: UserRepo
  private readonly _passwordHash: PasswordHasher

  constructor (services: {
    userRepository: UserRepo
    passwordHasher: PasswordHasher
  }) {
    this._userRepository = services.userRepository
    this._passwordHash = services.passwordHasher
  }

  async execute (credentials: RegisterUser): Promise<RegisteredUser> {
    await this._userRepository.verifyUsernameAvailability(credentials.username)

    const encryptedPass = await this._passwordHash.hash(credentials.password)

    return this._userRepository.addUser({
      ...credentials,
      password: encryptedPass
    })
  }
}

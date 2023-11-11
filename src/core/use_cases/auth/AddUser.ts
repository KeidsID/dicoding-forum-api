import type UserRepo from '../../repo/auth/UserRepo'
import type PasswordHasher from '../../security/PasswordHasher'

import type RegisteredUser from '../../entities/auth/RegisteredUser'
import type RegisterUser from '../../entities/auth/RegisterUser'

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

    return await this._userRepository.addUser({
      ...credentials,
      password: encryptedPass
    })
  }
}

// ./src/core/
import type RegisteredUser from '../../entities/auth/RegisteredUser'
import type RegisterUser from '../../entities/auth/RegisterUser'
import type UserRepo from '../../repo/auth/UserRepo'
import type PasswordHasher from '../../security/PasswordHasher'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../common/error/HttpError'

import type RegisterUser from '../../entities/auth/RegisterUser'
import type RegisteredUser from '../../entities/auth/RegisteredUser'

export default interface UserRepo {
  addUser: (registerUser: RegisterUser) => Promise<RegisteredUser>

  /**
   * Verify username availability.
   *
   * @throws {HttpError} if username already taken.
   */
  verifyUsernameAvailability: (username: string) => Promise<void>

  /**
   * Get encrypted password by username.
   *
   * @throws {HttpError} if user is not found.
   */
  getPasswordByUsername: (username: string) => Promise<string>

  /**
   * Get user id by username.
   *
   * @throws {HttpError} if user is not found.
   */
  getIdByUsername: (username: string) => Promise<string>
}

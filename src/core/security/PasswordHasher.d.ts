// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from 'src/common/error/HttpError'

export default interface PasswordHasher {
  /**
   * Encrypt a password.
   */
  hash: (password: string) => Promise<string>

  /**
   * Verify password with the encrypted one.
   *
   * @throws {HttpError} if password are not valid.
   */
  verifyPassword: (plain: string, encrypted: string) => Promise<void>
}

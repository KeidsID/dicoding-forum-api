// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from 'src/common/error/HttpError'

export default interface AuthRepo {
  addToken: (token: string) => Promise<void>

  /**
   * Verify token is valid.
   *
   * @throws {HttpError} if token is not found.
   */
  verifyToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<void>
}

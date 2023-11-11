// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../common/error/HttpError'

export default interface AuthTokenManager {
  createRefreshToken: (payload: object) => Promise<string>
  createAccessToken: (payload: object) => Promise<string>

  /**
   * Verify token.
   *
   * @throws {HttpError} if token are not valid.
   */
  verifyRefreshToken: (token: string) => Promise<void>

  /**
   * Extract payload from token.
   */
  decodePayload: (token: string) => Promise<object>
}

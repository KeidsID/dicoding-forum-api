import { type token } from '@hapi/jwt'

import * as Configs from 'src/common/env'
import HttpError from 'src/common/error/HttpError'
import type AuthTokenManager from 'src/core/security/AuthTokenManager'

export default class AuthTokenManagerImpl implements AuthTokenManager {
  private readonly _hapiJwt: typeof token

  constructor (hapiJwt: typeof token) {
    this._hapiJwt = hapiJwt
  }

  async createAccessToken (payload: any): Promise<string> {
    return this._hapiJwt.generate(payload, Configs.jwt.accessTokenKey)
  }

  async createRefreshToken (payload: any): Promise<string> {
    return this._hapiJwt.generate(payload, Configs.jwt.refreshTokenKey)
  }

  async verifyRefreshToken (token: string): Promise<void> {
    try {
      const artifacts = this._hapiJwt.decode(token)
      this._hapiJwt.verify(artifacts, Configs.jwt.refreshTokenKey)
    } catch (error) {
      throw HttpError.badRequest('refresh token tidak valid')
    }
  }

  async decodePayload (token: string): Promise<any> {
    const artifacts = this._hapiJwt.decode(token)
    return artifacts.decoded.payload
  }
}

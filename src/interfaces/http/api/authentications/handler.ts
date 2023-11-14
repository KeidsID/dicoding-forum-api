import type Bottle from 'bottlejs'

// ./src/
import type LoginUser from '../../../../core/use_cases/auth/LoginUser'
import type LogoutUser from '../../../../core/use_cases/auth/LogoutUser'
import type RefreshAuthentication from '../../../../core/use_cases/auth/RefreshAuthentication'
import { type HapiRouteHandler } from '../../../../types/index'

import Validators from '../../../validators/res/authentications'

export default class AuthenticationsHandler {
  private readonly _container: Bottle.IContainer

  constructor (_container: Bottle.IContainer) {
    this._container = _container

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this)
  }

  postAuthenticationHandler: HapiRouteHandler = async (request, h) => {
    const payload = request.payload

    if (!Validators.verifyUserLoginPayload(payload)) return

    const loginUser: LoginUser = this._container.LoginUser
    const { accessToken, refreshToken } = await loginUser.execute(payload)
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)

    return response
  }

  putAuthenticationHandler: HapiRouteHandler = async (request) => {
    const payload = request.payload

    if (!Validators.verifyRefreshTokenPayload(payload)) return

    const refreshAuth: RefreshAuthentication = this._container.RefreshAuthentication
    const accessToken = await refreshAuth.execute(payload)

    return {
      status: 'success',
      data: { accessToken }
    }
  }

  deleteAuthenticationHandler: HapiRouteHandler = async (request) => {
    const payload = request.payload

    if (!Validators.verifyRefreshTokenPayload(payload)) return

    const logoutUser: LogoutUser = this._container.LogoutUser
    await logoutUser.execute(payload)

    return { status: 'success' }
  }
}

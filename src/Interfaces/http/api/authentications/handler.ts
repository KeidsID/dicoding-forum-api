import type Bottle from 'bottlejs'

import type UserLogin from 'src/core/entities/auth/UserLogin'
import type LoginUser from 'src/core/use_cases/auth/LoginUser'
import type LogoutUser from 'src/core/use_cases/auth/LogoutUser'
import type RefreshAuthentication from 'src/core/use_cases/auth/RefreshAuthentication'
import { type HapiRouteHandler } from 'src/types'

export default class AuthenticationsHandler {
  private readonly _container: Bottle.IContainer

  constructor (_container: Bottle.IContainer) {
    this._container = _container

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this)
  }

  postAuthenticationHandler (): HapiRouteHandler {
    return async (request, h) => {
      const loginUser: LoginUser = this._container.LoginUser
      const { accessToken, refreshToken } = await loginUser.execute(
        request.payload as UserLogin
      )
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
  }

  putAuthenticationHandler (): HapiRouteHandler {
    return async (request) => {
      const refreshAuth: RefreshAuthentication = this._container.RefreshAuthentication
      const accessToken = await refreshAuth.execute(
        request.payload as { refreshToken: string }
      )

      return {
        status: 'success',
        data: {
          accessToken
        }
      }
    }
  }

  deleteAuthenticationHandler (): HapiRouteHandler {
    return async (request) => {
      const logoutUser: LogoutUser = this._container.LogoutUser
      await logoutUser.execute(request.payload as { refreshToken: string })

      return {
        status: 'success'
      }
    }
  }
}

/* istanbul ignore file */
import Jwt from '@hapi/jwt'

import AuthTokenManagerImpl from 'src/infrastructures/security/AuthTokenManagerImpl'
import AuthenticationsTableHelper from './AuthenticationsTableHelper'

export default {
  login: async (payload: { id: string, username: string }): Promise<string> => {
    const tokenManager = new AuthTokenManagerImpl(Jwt.token)

    const accessToken = await tokenManager.createAccessToken(payload)
    const refreshToken = await tokenManager.createRefreshToken(payload)

    await AuthenticationsTableHelper.addToken(refreshToken)

    return accessToken
  }
}

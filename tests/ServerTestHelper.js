/* istanbul ignore file */
const Jwt = require('@hapi/jwt')

const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager')
const AuthHelper = require('./AuthenticationsTableTestHelper')

module.exports = {
  /**
   * @param {object} payload
   * @param {string} payload.id
   * @param {string} payload.username
   *
   * @return {Promise<string>} access token
   */
  login: async (payload) => {
    const tokenManager = new JwtTokenManager(Jwt.token)

    const accessToken = tokenManager.createAccessToken(payload)
    const refreshToken = tokenManager.createRefreshToken(payload)

    await AuthHelper.addToken(refreshToken)

    return accessToken
  }
}

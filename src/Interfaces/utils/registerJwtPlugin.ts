import * as Jwt from '@hapi/jwt'
import type * as HapiTypes from 'hapi'

import * as Constants from 'src/common/constants'
import * as Configs from 'src/common/env'
import { type ApiAuthCredentials } from 'src/types'

export default async (server: HapiTypes.Server): Promise<void> => {
  await server.register([
    { plugin: Jwt.plugin }
  ])

  // external plugins config
  server.auth.strategy(Constants.DEFAULT_AUTH_ID, 'jwt', {
    keys: Configs.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Configs.jwt.accessTokenAge
    },
    validate: (artifacts: any) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username
      } satisfies ApiAuthCredentials
    })
  })
}

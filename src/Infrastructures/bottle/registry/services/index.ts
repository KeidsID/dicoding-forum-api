import * as bcrypt from 'bcrypt'
import * as Jwt from '@hapi/jwt'
import { nanoid } from 'nanoid'

import pool from 'src/infrastructures/db/psql/pool'

import bottle from 'src/infrastructures/bottle'

/**
 * Register external services.
 */
export default (): void => {
  bottle.service('pool', () => pool)
  bottle.service('nanoid', () => nanoid)
  bottle.service('bcrypt', () => bcrypt)
  bottle.service('hapiJwt', () => Jwt.token)
}

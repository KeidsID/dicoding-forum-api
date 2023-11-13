import * as bcrypt from 'bcrypt'
import * as Jwt from '@hapi/jwt'
import { nanoid } from 'nanoid'

// ./src/infrastructures/
import pool from '../../db/psql/pool'
import bottle from '..'

/**
 * Register external services.
 */
export default (): void => {
  bottle.factory('pool', () => pool)
  bottle.factory('nanoid', () => nanoid)
  bottle.factory('bcrypt', () => bcrypt)
  bottle.factory('hapiJwt', () => Jwt.token)
}

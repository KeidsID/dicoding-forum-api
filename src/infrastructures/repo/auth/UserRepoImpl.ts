import { type Pool, type QueryConfig } from 'pg'

// ./src/
import HttpError from '../../../common/error/HttpError'
import type RegisterUser from '../../../core/entities/auth/RegisterUser'
import type RegisteredUser from '../../../core/entities/auth/RegisteredUser'
import type UserRepo from '../../../core/repo/auth/UserRepo'

export default class UserRepoImpl implements UserRepo {
  private readonly _pool: Pool
  private readonly _idGenerator: () => string

  constructor (pool: Pool, idGenerator: () => string) {
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyUsernameAvailability (username: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const { rowCount } = await this._pool.query(query)

    if (rowCount as number > 0) {
      throw HttpError.badRequest('username tidak tersedia')
    }
  }

  async addUser (registerUser: RegisterUser): Promise<RegisteredUser> {
    const { username, password, fullname } = registerUser
    const id = `user-${this._idGenerator()}`

    const query: QueryConfig = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname]
    }

    const result = await this._pool.query(query)

    return { ...result.rows[0] }
  }

  async getPasswordByUsername (username: string): Promise<string> {
    const query: QueryConfig = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount as number <= 0) {
      throw HttpError.badRequest('username tidak ditemukan')
    }

    return result.rows[0].password
  }

  async getIdByUsername (username: string): Promise<string> {
    const query: QueryConfig = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount as number <= 0) {
      throw HttpError.badRequest('user tidak ditemukan')
    }

    return result.rows[0].id
  }
}

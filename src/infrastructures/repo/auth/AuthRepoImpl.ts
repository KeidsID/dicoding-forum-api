import { type Pool, type QueryConfig } from 'pg'

// ./src/
import HttpError from '../../../common/error/HttpError'
import type AuthRepo from '../../../core/repo/auth/AuthRepo'

export default class AuthRepoImpl implements AuthRepo {
  private readonly _pool: Pool

  constructor (pool: Pool) {
    this._pool = pool
  }

  async addToken (token: string): Promise<void> {
    const query: QueryConfig = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token]
    }

    await this._pool.query(query)
  }

  async verifyToken (token: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token]
    }

    const result = await this._pool.query(query)

    if (result.rows.length === 0) {
      throw HttpError.badRequest('refresh token tidak ditemukan di database')
    }
  }

  async deleteToken (token: string): Promise<void> {
    const query: QueryConfig = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    }

    await this._pool.query(query)
  }
}

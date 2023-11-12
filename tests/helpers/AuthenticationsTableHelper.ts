/* istanbul ignore file */

import { type QueryConfig } from 'pg'

import pool from 'src/infrastructures/db/psql/pool'

export default {
  async addToken (token: string) {
    const query: QueryConfig = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token]
    }

    await pool.query(query)
  },

  async findToken (token: string): Promise<any[]> {
    const query: QueryConfig = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM authentications WHERE 1=1')
  }
}

/* istanbul ignore file */

import { type QueryConfig } from 'pg'

import pool from 'src/infrastructures/db/psql/pool'

export default {
  async addUser ({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia'
  }) {
    const query: QueryConfig = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    }

    await pool.query(query)
  },

  async findUsersById (id: string) {
    const query: QueryConfig = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM users WHERE 1=1')
  }
}

/* istanbul ignore file */

import { type QueryConfig } from 'pg'

import pool from 'src/infrastructures/db/psql/pool'

export default {
  async addThread ({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    owner = 'user-123'
  }) {
    const query: QueryConfig = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner]
    }

    await pool.query(query)
  },

  async findThreadById (id: string) {
    const query: QueryConfig = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const { rows } = await pool.query(query)

    return rows
  }
}

/* istanbul ignore file */

import { type QueryConfig } from 'pg'

import pool from '../../src/infrastructures/db/psql/pool'

export default {
  async addCommentToThread ({
    commentId = 'comment-123',
    threadId = 'thread-123',
    content = 'A comment',
    owner = 'user-123'
  }) {
    const query: QueryConfig = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4)',
      values: [commentId, threadId, content, owner]
    }

    await pool.query(query)
  },

  async findCommentById (commentId: string) {
    const query: QueryConfig = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [commentId]
    }
    const { rows } = await pool.query(query)

    return rows
  },

  async softDeleteComment (commentId: string) {
    const query: QueryConfig = {
      text: `
        UPDATE thread_comments SET is_deleted = TRUE
        WHERE id = $1
      `,
      values: [commentId]
    }
    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM thread_comments')
  }
}

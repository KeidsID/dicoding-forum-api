/* istanbul ignore file */

import { type QueryConfig } from 'pg'

import pool from '../../src/infrastructures/db/psql/pool'

export default {
  async addReplyToComment ({
    replyId = 'reply-123',
    commentId = 'comment-123',
    content = 'A reply',
    owner = 'user-123'
  }) {
    const query: QueryConfig = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4)',
      values: [replyId, commentId, content, owner]
    }

    await pool.query(query)
  },

  async findReplyById (replyId: string) {
    const query: QueryConfig = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [replyId]
    }
    const { rows } = await pool.query(query)

    return rows
  },

  async softDeleteReply (replyId: string) {
    const query: QueryConfig = {
      text: `
        UPDATE thread_comment_replies SET is_deleted = TRUE
        WHERE id = $1
      `,
      values: [replyId]
    }
    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM thread_comment_replies')
  }
}

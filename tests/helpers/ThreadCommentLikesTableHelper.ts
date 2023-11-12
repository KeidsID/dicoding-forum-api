/* istanbul ignore file */

import { type QueryConfig } from 'pg'

import pool from 'src/infrastructures/db/psql/pool'

export default {
  async likeAComment ({
    likeId = 'comment-like-123',
    commentId = 'comment-123',
    liker = 'user-123'
  }) {
    const query: QueryConfig = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [likeId, commentId, liker]
    }

    await pool.query(query)
  },

  async dislikeAComment ({
    commentId = 'comment-123',
    liker = 'user-123'
  }) {
    const query: QueryConfig = {
      text: `
        DELETE FROM thread_comment_likes 
        WHERE comment_id = $1 AND liker = $2
      `,
      values: [commentId, liker]
    }

    await pool.query(query)
  },

  async getCommentLike (commentLikeId: string) {
    const query: QueryConfig = {
      text: 'SELECT comment_id AS "commentId", liker FROM thread_comment_likes WHERE id = $1',
      values: [commentLikeId]
    }

    const { rows } = await pool.query(query)

    return rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM thread_comment_likes')
  }
}

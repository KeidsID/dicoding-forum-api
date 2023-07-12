/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async likeAComment ({
    likeId = 'comment-like-123',
    commentId = 'comment-123',
    liker = 'user-123'
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [likeId, commentId, liker]
    }

    await pool.query(query)
  },

  async dislikeAComment ({
    commentId = 'comment-123',
    liker = 'user-123'
  }) {
    const query = {
      text: `
        DELETE FROM thread_comment_likes 
        WHERE comment_id = $1 AND liker = $2
      `,
      values: [commentId, liker]
    }

    await pool.query(query)
  },

  async getCommentLike (commentLikeId) {
    const query = {
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

/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const ThreadCommentLikesRepository = require('../../../Domains/threads/comments/ThreadCommentLikesRepository')

class ThreadCommentLikesRepositoryPostgres extends ThreadCommentLikesRepository {
  /**
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   */
  constructor (pool, idGenerator) {
    super()

    this.#pool = pool
    this.#idGenerator = idGenerator
  }

  #pool
  #idGenerator

  async likeAComment (commentId, liker) {
    const id = `comment-like-${this.#idGenerator()}`

    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, liker]
    }
    await this.#pool.query(query)
  }

  async dislikeAComment (commentId, liker) {
    const query = {
      text: `
        DELETE FROM thread_comment_likes 
        WHERE comment_id = $1 AND liker = $2
      `,
      values: [commentId, liker]
    }
    await this.#pool.query(query)
  }

  async verifyCommentLike (commentId, liker) {
    const query = {
      text: `
        SELECT id FROM thread_comment_likes 
        WHERE comment_id = $1 AND liker = $2
      `,
      values: [commentId, liker]
    }
    const { rowCount } = await this.#pool.query(query)

    return !!rowCount
  }
}

module.exports = ThreadCommentLikesRepositoryPostgres

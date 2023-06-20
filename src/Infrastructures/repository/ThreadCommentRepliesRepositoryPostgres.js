/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const AuthorizationError = require('../../Common/exceptions/AuthorizationError')
const NotFoundError = require('../../Common/exceptions/NotFoundError')

const ThreadCommentRepliesRepository = require('../../Domains/threads/replies/ThreadCommentRepliesRepository')

const AddedReply = require('../../Domains/threads/replies/entities/AddedReply')
const Reply = require('../../Domains/threads/replies/entities/Reply')

class ThreadCommentRepliesRepositoryPostgres extends ThreadCommentRepliesRepository {
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

  async addReplyToComment (commentId, { content }, owner) {
    const id = `reply-${this.#idGenerator()}`

    const query = {
      text: `INSERT INTO thread_comment_replies VALUES(
        $1, $2, $3, $4
      ) RETURNING id, content, owner`,
      values: [id, commentId, content, owner]
    }
    const { rows } = await this.#pool.query(query)

    return new AddedReply({ ...rows[0] })
  }

  async verifyReplyAccess (replyId, userId) {
    const query = {
      text: 'SELECT owner FROM thread_comment_replies WHERE id = $1',
      values: [replyId]
    }
    const { rows, rowCount } = await this.#pool.query(query)

    if (!rowCount) throw new NotFoundError('balasan tidak ditemukan')

    if (rows[0].owner !== userId) throw new AuthorizationError('anda tidak dapat mengakses balasan orang lain')
  }

  async softDeleteReply (replyId, userId) {
    await this.verifyReplyAccess(replyId, userId)

    const query = {
      text: `
        UPDATE thread_comment_replies SET is_deleted = TRUE
        WHERE id = $1 RETURNING id
      `,
      values: [replyId]
    }
    await this.#pool.query(query)
  }

  async getRepliesFromComment (commentId) {
    const query = {
      text: `
        SELECT 
          thread_comment_replies.id, 
          users.username, 
          thread_comment_replies.date, 
          thread_comment_replies.content, 
          thread_comment_replies.is_deleted
        FROM thread_comment_replies 
        LEFT JOIN users 
          ON thread_comment_replies.owner = users.id
        WHERE comment_id = $1
        GROUP BY 
          thread_comment_replies.id, users.username
        ORDER BY date
      `,
      values: [commentId]
    }
    const { rows, rowCount } = await this.#pool.query(query)

    if (!rowCount) return []

    const replies = rows.map((val, index, arr) => {
      if (val.is_deleted) {
        val.content = '**balasan telah dihapus**'
      }

      delete val.is_deleted

      return new Reply({ ...val })
    })

    return replies
  }
}

module.exports = ThreadCommentRepliesRepositoryPostgres

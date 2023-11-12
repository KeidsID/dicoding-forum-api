/* eslint-disable no-unused-vars */
import { type Pool, type QueryConfig } from 'pg'

// ./src/
import HttpError from '../../../common/error/HttpError'
import type AddedReply from '../../../core/entities/threads/comments/replies/AddedReply'
import type NewReply from '../../../core/entities/threads/comments/replies/NewReply'
import type ThreadCommentRepliesRepo from '../../../core/repo/threads/ThreadCommentRepliesRepo'

export default class ThreadCommentRepliesRepoImpl implements ThreadCommentRepliesRepo {
  private readonly _pool: Pool
  private readonly _idGenerator: () => string

  constructor (pool: Pool, idGenerator: () => string) {
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReplyToComment (
    commentId: string, payload: NewReply, owner: string
  ): Promise<AddedReply> {
    const { content } = payload
    const id = `reply-${this._idGenerator()}`

    const query: QueryConfig = {
      text: `INSERT INTO thread_comment_replies VALUES(
        $1, $2, $3, $4
      ) RETURNING id, content, owner`,
      values: [id, commentId, content, owner]
    }
    const { rows } = await this._pool.query(query)

    return { ...rows[0] }
  }

  async verifyReplyAccess (replyId: string, userId: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT owner FROM thread_comment_replies WHERE id = $1',
      values: [replyId]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (rowCount <= 0) throw HttpError.notFound('balasan tidak ditemukan')

    if (rows[0].owner !== userId) {
      throw HttpError.forbidden('anda tidak dapat mengakses balasan orang lain')
    }
  }

  async softDeleteReply (replyId: string, userId: string): Promise<void> {
    await this.verifyReplyAccess(replyId, userId)

    const query: QueryConfig = {
      text: `
        UPDATE thread_comment_replies SET is_deleted = TRUE
        WHERE id = $1 RETURNING id
      `,
      values: [replyId]
    }
    await this._pool.query(query)
  }

  async getRawRepliesFromComments (commentIds: string[]): Promise<any[]> {
    const query: QueryConfig = {
      text: `
        SELECT
          tcr.id, users.username, 
          tcr.date, tcr.content, 
          tcr.is_deleted AS "isDeleted",
          tcr.comment_id AS "commentId"
        FROM thread_comment_replies AS tcr
        LEFT JOIN users
          ON tcr.owner = users.id
        WHERE comment_id = ANY($1::TEXT[])
        GROUP BY 
          tcr.id, users.username
        ORDER BY date
      `,
      values: [commentIds]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (rowCount <= 0) return []

    return rows
  }
}

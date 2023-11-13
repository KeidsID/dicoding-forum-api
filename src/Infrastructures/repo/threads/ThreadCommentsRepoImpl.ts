import { type Pool, type QueryConfig } from 'pg'

// ./src/
import HttpError from '../../../common/error/HttpError'
import type AddedComment from '../../../core/entities/threads/comments/AddedComment'
import Comment from '../../../core/entities/threads/comments/Comment'
import type NewComment from '../../../core/entities/threads/comments/NewComment'
import type ThreadCommentsRepo from '../../../core/repo/threads/ThreadCommentsRepo'

export default class ThreadCommentsRepoImpl implements ThreadCommentsRepo {
  private readonly _pool: Pool
  private readonly _idGenerator: () => string

  constructor (pool: Pool, idGenerator: () => string) {
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addCommentToThread (
    threadId: string, payload: NewComment, owner: string
  ): Promise<AddedComment> {
    const { content } = payload
    const id = `comment-${this._idGenerator()}`

    const query: QueryConfig = {
      text: `INSERT INTO thread_comments VALUES(
        $1, $2, $3, $4
      ) RETURNING id, content, owner`,
      values: [id, threadId, content, owner]
    }
    const { rows } = await this._pool.query(query)

    return { ...rows[0] }
  }

  async verifyCommentAccess (commentId: string, userId: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT owner FROM thread_comments WHERE id = $1',
      values: [commentId]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (rowCount as number <= 0) throw HttpError.notFound('komentar tidak ditemukan')

    if (rows[0].owner !== userId) {
      throw HttpError.forbidden('anda tidak dapat mengakses komentar orang lain')
    }
  }

  async softDeleteCommentById (commentId: string, userId: string): Promise<void> {
    await this.verifyCommentAccess(commentId, userId)

    const query: QueryConfig = {
      text: `
        UPDATE thread_comments SET is_deleted = TRUE
        WHERE id = $1 RETURNING id
      `,
      values: [commentId]
    }
    await this._pool.query(query)
  }

  async getCommentsFromThread (threadId: string): Promise<Comment[]> {
    const query: QueryConfig = {
      text: `
        SELECT 
          tc.id, users.username, 
          tc.date, tc.content, 
          tc.is_deleted AS "isDeleted",
          COALESCE(COUNT(tcl.id), 0)::INT AS "likeCount"
        FROM thread_comments AS tc
        LEFT JOIN users ON tc.owner = users.id
        LEFT JOIN thread_comment_likes AS tcl ON tc.id = tcl.comment_id
        WHERE thread_id = $1
        GROUP BY tc.id, users.username
        ORDER BY date
      `,
      values: [threadId]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (rowCount as number <= 0) return []

    return rows.map((rawComment) => new Comment(rawComment))
  }

  async verifyCommentLocation (commentId: string, threadId: string): Promise<void> {
    const query: QueryConfig = {
      text: `
        SELECT thread_id AS "threadId" FROM thread_comments
        WHERE id = $1
      `,
      values: [commentId]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (rowCount as number <= 0) throw HttpError.notFound('komentar tidak ditemukan')

    if (rows[0].threadId !== threadId) {
      throw HttpError.notFound('komentar tidak ditemukan pada thread ini')
    }
  }
}

import { type Pool, type QueryConfig } from 'pg'

import type ThreadCommentLikesRepo from 'src/core/repo/threads/ThreadCommentLikesRepo'

export default class ThreadCommentLikesRepoPostgres implements ThreadCommentLikesRepo {
  private readonly _pool: Pool
  private readonly _idGenerator: () => string

  constructor (pool: Pool, idGenerator: () => string) {
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async likeAComment (commentId: string, liker: string): Promise<void> {
    const id = `comment-like-${this._idGenerator()}`

    const query: QueryConfig = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, liker]
    }
    await this._pool.query(query)
  }

  async dislikeAComment (commentId: string, liker: string): Promise<void> {
    const query: QueryConfig = {
      text: `
        DELETE FROM thread_comment_likes 
        WHERE comment_id = $1 AND liker = $2
      `,
      values: [commentId, liker]
    }
    await this._pool.query(query)
  }

  async verifyCommentLike (commentId: string, liker: string): Promise<boolean> {
    const query: QueryConfig = {
      text: `
        SELECT id FROM thread_comment_likes 
        WHERE comment_id = $1 AND liker = $2
      `,
      values: [commentId, liker]
    }
    const { rowCount } = await this._pool.query(query)

    return rowCount > 0
  }
}

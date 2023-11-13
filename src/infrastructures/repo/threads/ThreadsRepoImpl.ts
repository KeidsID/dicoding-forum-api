import { type QueryConfig, type Pool } from 'pg'

// ./src/
import HttpError from '../../../common/error/HttpError'
import type AddedThread from '../../../core/entities/threads/AddedThread'
import type NewThread from '../../../core/entities/threads/NewThread'
import type Thread from '../../../core/entities/threads/Thread'
import type ThreadsRepo from '../../../core/repo/threads/ThreadsRepo'

export default class ThreadsRepoImpl implements ThreadsRepo {
  private readonly _pool: Pool
  private readonly _idGen: () => string

  constructor (pool: Pool, idGen: () => string) {
    this._pool = pool
    this._idGen = idGen
  }

  async addThread (payload: NewThread, owner: string): Promise<AddedThread> {
    const { title, body } = payload
    const id = `thread-${this._idGen()}`

    const query: QueryConfig = {
      text: `INSERT INTO threads VALUES (
        $1, $2, $3, $4
      ) RETURNING id, title, owner`,
      values: [id, title, body, owner]
    }
    const { rows } = await this._pool.query(query)

    return { ...rows[0] }
  }

  async getThreadById (threadId: string): Promise<Thread> {
    const query: QueryConfig = {
      text: `
        SELECT 
          threads.id, threads.title, threads.body, 
          threads.date, users.username
        FROM threads 
        LEFT JOIN users ON threads.owner = users.id
        WHERE threads.id = $1
        GROUP BY threads.id, users.username
      `,
      values: [threadId]
    }
    const { rows, rowCount } = await this._pool.query(query)

    if (rowCount as number <= 0) throw HttpError.notFound('thread tidak ditemukan')

    return { ...rows[0] }
  }

  async verifyThread (threadId: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId]
    }
    const { rowCount } = await this._pool.query(query)

    if (rowCount as number <= 0) throw HttpError.notFound('thread tidak ditemukan')
  }
}

/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const Thread = require('../../../Domains/threads/entities/Thread')
const NotFoundError = require('../../../Common/exceptions/NotFoundError')

class ThreadsRepositoryPostgres extends ThreadsRepository {
  /**
   * @param {Pool} pool
   * @param {nanoid} idGen
   */
  constructor (pool, idGen) {
    super()

    this.#pool = pool
    this.#idGen = idGen
  }

  #pool
  #idGen

  async addThread ({ title, body }, owner) {
    const id = `thread-${this.#idGen()}`

    const query = {
      text: `INSERT INTO threads VALUES (
        $1, $2, $3, $4
      ) RETURNING id, title, owner`,
      values: [id, title, body, owner]
    }
    const { rows } = await this.#pool.query(query)

    return new AddedThread({ ...rows[0] })
  }

  async getThreadById (threadId) {
    const query = {
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
    const { rows, rowCount } = await this.#pool.query(query)

    if (!rowCount) throw new NotFoundError('thread tidak ditemukan')

    return new Thread({ ...rows[0] })
  }

  async verifyThread (threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId]
    }
    const { rowCount } = await this.#pool.query(query)

    if (!rowCount) throw new NotFoundError('thread tidak ditemukan')
  }
}

module.exports = ThreadsRepositoryPostgres

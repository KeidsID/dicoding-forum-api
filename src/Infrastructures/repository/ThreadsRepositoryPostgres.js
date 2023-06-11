/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const ThreadsRepository = require('../../Domains/threads/ThreadsRepository')
const Thread = require('../../Domains/threads/entities/Thread')
const AddedThread = require('../../Domains/threads/entities/AddedThread')

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

  /**
   * Add a thread to the database.
   *
   * @param {Thread} thread
   * @param {string} owner
   *
   * @return {Promise<AddedThread>}
   */
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
}

module.exports = ThreadsRepositoryPostgres

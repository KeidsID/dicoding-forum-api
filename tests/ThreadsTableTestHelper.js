/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async addThread ({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    owner = 'user-123'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner]
    }

    await pool.query(query)
  },

  async findThreadById (id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const { rows } = await pool.query(query)

    return rows
  }
}

module.exports = ThreadsTableTestHelper

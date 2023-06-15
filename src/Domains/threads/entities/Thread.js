class Thread {
  /**
   * @param {object} payload
   * @param {string} payload.id
   * @param {string} payload.title
   * @param {string} payload.body
   * @param {Date} payload.date
   * @param {string} payload.username
   */
  constructor (payload) {
    this.#verifyPayload(payload)

    this.id = payload.id
    this.title = payload.title
    this.body = payload.body
    this.date = payload.date
    this.username = payload.username
  }

  #verifyPayload ({ id, title, body, date, username }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' || typeof title !== 'string' ||
      typeof body !== 'string' || !(date instanceof Date) ||
      typeof username !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Thread

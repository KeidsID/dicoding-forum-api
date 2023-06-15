class NewThread {
  /**
   * @param {object} payload
   * @param {string} payload.title
   * @param {string} payload.body
   */
  constructor (payload) {
    this.#verifyPayload(payload)

    const { title, body } = payload

    this.title = title
    this.body = body
  }

  #verifyPayload ({ title, body }) {
    if (!title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewThread

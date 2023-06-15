class NewComment {
  /**
   * @param {object} payload
   * @param {string} payload.content
   */
  constructor (payload) {
    this.#verifyPayload(payload)

    const { content } = payload

    this.content = content
  }

  #verifyPayload ({ content }) {
    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewComment

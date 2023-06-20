class AddedComment {
  /**
   * @param {object} payload
   * @param {string} payload.id
   * @param {string} payload.content
   * @param {string} payload.owner
   */
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, content, owner } = payload

    this.id = id
    this.content = content
    this.owner = owner
  }

  _verifyPayload ({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddedComment

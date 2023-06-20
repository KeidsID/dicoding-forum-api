class Reply {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.username
   * @param {Date} props.date
   * @param {string} props.content
   */
  constructor (props) {
    this.#verifyProps(props)

    this.id = props.id
    this.username = props.username
    this.date = props.date
    this.content = props.content
  }

  #verifyProps ({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' || typeof username !== 'string' ||
      !(date instanceof Date) || typeof content !== 'string'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Reply

/* eslint-disable camelcase */

exports.shorthands = undefined

const TABLE_NAME = 'thread_comment_likes'
const FK_COMMENT_ID = `fk_${TABLE_NAME}.comment_id_thread_comments.id`
const FK_LIKER = `fk_${TABLE_NAME}.liker_users.id`

exports.up = pgm => {
  pgm.createTable(TABLE_NAME, {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    comment_id: { type: 'VARCHAR(50)', notNull: true },
    liker: { type: 'VARCHAR(50)', notNull: true }
  })

  pgm.addConstraint(TABLE_NAME, FK_COMMENT_ID,
    'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(TABLE_NAME, FK_LIKER,
    'FOREIGN KEY(liker) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = pgm => {
  pgm.dropTable(TABLE_NAME)
}

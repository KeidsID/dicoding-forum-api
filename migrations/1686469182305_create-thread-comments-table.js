/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('thread_comments', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    thread_id: { type: 'VARCHAR(50)', notNull: true },
    content: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: pgm.func('FALSE')
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP')
    }
  })

  pgm.addConstraint('thread_comments', 'fk_thread_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  )
  pgm.addConstraint('thread_comments', 'fk_thread_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = pgm => {
  pgm.dropTable('thread_comments')
}

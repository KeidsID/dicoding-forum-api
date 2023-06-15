/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('thread_comments', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    thread_id: { type: 'VARCHAR(50)', notNull: true },
    content: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
    is_deleted: { type: 'BOOLEAN', notNull: true },
    date: { type: 'TIMESTAMPTZ', notNull: true }
  })

  pgm.sql(`
    ALTER TABLE thread_comments 
      ALTER is_deleted SET DEFAULT FALSE,
      ALTER date SET DEFAULT CURRENT_TIMESTAMP
  `.trim())

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

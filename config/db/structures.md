# Database Tables Structures

This file will define the tables structure on this database server.

- [users](#users)
- [authentications](#authentications)
- [threads](#threads)
- [thread_comment](#thread_comment)
- [thread_comment_replies](#thread_comment_replies)

## users

| id         | username | password     | fullname |
| ---------- | -------- | ------------ | -------- |
| "user-xyz" | "xyz"    | "SecretPass" | "XyZ"    |

## authentications

| token               |
| ------------------- |
| "jwt.token.example" |

## threads

| id           | title           | body                 | owner      | date                       |
| ------------ | --------------- | -------------------- | ---------- | -------------------------- |
| "thread-xyz" | "sebuah thread" | "sebuah body thread" | "user-xyz" | "2021-08-08T07:19:09.775Z" |

### Defaults

- `date SET DEFAULT CURRENT_TIMESTAMP`

### Constraints

- `FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE`

## thread_comments

| id            | thread_id   | content          | owner      | is_deleted | date                       |
| ------------- | ----------- | ---------------- | ---------- | ---------- | -------------------------- |
| "comment-xyz" | "thread-id" | "sebuah comment" | "user-ijk" | false      | "2021-09-08T07:19:09.775Z" |

### Defaults

- `is_deleted SET DEFAULT false`
- `date SET DEFAULT CURRENT_TIMESTAMP`

### Constraints

- `FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE`
- `FOREIGN KEY(commenter) REFERENCES users(id) ON DELETE CASCADE`

## thread_comment_likes

| id                 | comment_id    | liker      |
| ------------------ | ------------- | ---------- |
| "comment-like-xyz" | "comment-xyz" | "user-xyz" |

### Constraints

- `FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE`
- `FOREIGN KEY(liker) REFERENCES users(id) ON DELETE CASCADE`

## thread_comment_replies

| id          | comment_id  | content          | owner      | is_deleted | date                       |
| ----------- | ----------- | ---------------- | ---------- | ---------- | -------------------------- |
| "reply-xyz" | "thread-id" | "sebuah comment" | "user-ijk" | false      | "2021-09-08T07:19:09.775Z" |

### Defaults

- `is_deleted SET DEFAULT false`
- `date SET DEFAULT CURRENT_TIMESTAMP`

### Constraints

- `FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE`
- `FOREIGN KEY(commenter) REFERENCES users(id) ON DELETE CASCADE`

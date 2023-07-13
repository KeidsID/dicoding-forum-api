## 1.2.0

### Added

- Feature to like and dislike a comment.
  Method and Endpoint: `PUT threads/{threadId}/comments/{commentId}/likes`

- Thread details will respond like count too.

### Fixed

- Fix wrong script on CD workflow.

## 1.1.2

### Added

- Reduced server workload with `verifyThread` method

## 1.1.1

### Added

- Root endpoint ("/") that redirect to
  https://docs.page/KeidsID/dicoding-forum-api

### Changed

- Refactor folder structures
- Test files update
- Moved comment and reply is_deleted logic to Domain folder

## 1.1.0

### Added

- Reply features on "/threads" endpoint.
  - `POST /threads/{threadId}/comments/{commentId}/replies` - Reply on comment
  - `DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}` - Delete
    reply from comment

## 1.0.0

### Added

- User registration on "/users" endpoint.
  - `POST /users` - Register new user
- Authentication features on "/authentications" endpoint.
  - `POST /authentications` - Login to get access token
  - `PUT /authentications` - Refresh token session
  - `DELETE /authentications` - Logout to delete token session
- Thread features on "/threads" endpoint.
  - `POST /threads` - Posting thread
  - `GET /threads/{threadId}` - Get thread details
  - `POST /threads/{threadId}/comments` - Add comment to thread
  - `DELETE /threads/{threadId}/comments/{commentId}` - Soft delete comment from
    thread

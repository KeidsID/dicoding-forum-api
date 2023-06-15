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

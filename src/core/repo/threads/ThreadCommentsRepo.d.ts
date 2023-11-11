import type AddedComment from '../../entities/threads/comments/AddedComment'
import type Comment from '../../entities/threads/comments/Comment'
import type NewComment from '../../entities/threads/comments/NewComment'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../common/error/HttpError'

export default interface ThreadCommentsRepo {
  /**
   * Add comment to a thread.
   */
  addCommentToThread: (
    threadId: string,
    newComment: NewComment,
    owner: string
  ) => Promise<AddedComment>

  /**
   * Verify if user is the comment owner.
   *
   * @throws {HttpError} if user is not the comment owner.
   */
  verifyCommentAccess: (commentId: string, userId: string) => Promise<void>

  /**
   * Soft delete (only add is deleted status) a comment.
   *
   * @throws {HttpError} if user is not the comment owner.
   */
  softDeleteCommentById: (commentId: string, userId: string) => Promise<void>

  /**
   * Fetch comments from thread.
   */
  getCommentsFromThread: (threadId: string) => Promise<Comment[]>

  /**
   * Verify comment relation to the thread.
   *
   * @throws {HttpError} if comment not found on the thread.
   */
  verifyCommentLocation: (commentId: string, threadId: string) => Promise<void>
}

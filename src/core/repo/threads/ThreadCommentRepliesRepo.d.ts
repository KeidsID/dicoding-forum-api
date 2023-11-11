import type AddedReply from 'src/core/entities/threads/comments/replies/AddedReply'
import type NewReply from 'src/core/entities/threads/comments/replies/NewReply'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from 'src/common/error/HttpError'

export default interface ThreadCommentRepliesRepo {
  /**
   * Reply a comment.
   */
  addReplyToComment: (
    commentId: string,
    newReply: NewReply,
    owner: string
  ) => Promise<AddedReply>

  /**
   * Verify reply access.
   *
   * @throws {HttpError} if user are not the reply owner.
   */
  verifyReplyAccess: (replyId: string, userId: string) => Promise<void>

  /**
   * Soft delete (only add is deleted status) a reply.
   */
  softDeleteReply: (replyId: string, userId: string) => Promise<void>

  /**
   * Fetch raw replies (not Reply entity) from comments.
   *
   * Note that this method will fetch all replies from all comments,
   * not a single comment.
   */
  getRawRepliesFromComments: (commentIds: string[]) => Promise<Array<{
    id: string
    username: string
    date: Date
    content: string
    isDeleted: boolean
    commentId: string
  }>>
}

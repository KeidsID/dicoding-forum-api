// ./src/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../../../common/error/HttpError'
import { isNewReply } from '../../../../../interfaces/validators'

// ./src/core/
import type AddedReply from '../../../../entities/threads/comments/replies/AddedReply'
import type NewReply from '../../../../entities/threads/comments/replies/NewReply'
import type ThreadsRepo from '../../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../../repo/threads/ThreadCommentsRepo'
import type ThreadCommentRepliesRepo from '../../../../repo/threads/ThreadCommentRepliesRepo'

export default class AddReplyToComment {
  private readonly _threadsRepo: ThreadsRepo
  private readonly _threadCommentsRepo: ThreadCommentsRepo
  private readonly _threadCommentRepliesRepo: ThreadCommentRepliesRepo

  constructor (services: {
    threadsRepo: ThreadsRepo
    threadCommentsRepo: ThreadCommentsRepo
    threadCommentRepliesRepo: ThreadCommentRepliesRepo
  }) {
    this._threadsRepo = services.threadsRepo
    this._threadCommentsRepo = services.threadCommentsRepo
    this._threadCommentRepliesRepo = services.threadCommentRepliesRepo
  }

  /**
   * Add reply to a comment.
   *
   * @param owner - user id who is adding a reply
   *
   * @throws {HttpError}
   */
  async execute (
    threadId: string, commentId: string,
    payload: NewReply, owner: string
  ): Promise<AddedReply> {
    if (!isNewReply(payload)) throw HttpError.badRequest('invalid payload')

    await this._threadsRepo.verifyThread(threadId)
    await this._threadCommentsRepo.verifyCommentLocation(commentId, threadId)

    return await this._threadCommentRepliesRepo.addReplyToComment(commentId, payload, owner)
  }
}

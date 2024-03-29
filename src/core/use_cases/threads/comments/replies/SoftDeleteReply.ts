// ./src/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../../../common/error/HttpError'

// ./src/core/
import type ThreadsRepo from '../../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../../repo/threads/ThreadCommentsRepo'
import type ThreadCommentRepliesRepo from '../../../../repo/threads/ThreadCommentRepliesRepo'

export default class SoftDeleteReply {
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
   * Soft delete a reply from the database.
   *
   * - Throw `HttpError.notFound()` if thread/comment/reply is not found.
   * - Throw `HttpError.forbidden()` if user is not the reply owner.
   *
   * @throws {HttpError}
   */
  async execute (
    threadId: string, commentId: string,
    replyId: string, userId: string
  ): Promise<void> {
    await this._threadsRepo.verifyThread(threadId)
    await this._threadCommentsRepo.verifyCommentLocation(commentId, threadId)

    await this._threadCommentRepliesRepo.softDeleteReply(replyId, userId)
  }
}

import type ThreadsRepo from '../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../repo/threads/ThreadCommentsRepo'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../../common/error/HttpError'

export default class SoftDeleteCommentUseCase {
  private readonly _threadsRepo: ThreadsRepo
  private readonly _threadCommentsRepo: ThreadCommentsRepo
  constructor (services: {
    threadsRepo: ThreadsRepo
    threadCommentsRepo: ThreadCommentsRepo
  }) {
    this._threadsRepo = services.threadsRepo
    this._threadCommentsRepo = services.threadCommentsRepo
  }

  /**
   * Soft delete a comment from the database.
   *
   * - Throw `HttpError.notFound()` if thread/comment is not found.
   * - Throw `HttpError.forbidden()` if user is not the comment owner.
   *
   * @throws {HttpError}
   */
  async execute (threadId: string, commentId: string, userId: string): Promise<void> {
    await this._threadsRepo.verifyThread(threadId)

    await this._threadCommentsRepo.softDeleteCommentById(commentId, userId)
  }
}

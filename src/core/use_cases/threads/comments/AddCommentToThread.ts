// ./src/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../../common/error/HttpError'
import { isNewComment } from '../../../../interfaces/validators'

// ./src/core/
import type AddedComment from '../../../entities/threads/comments/AddedComment'
import type NewComment from '../../../entities/threads/comments/NewComment'
import type ThreadsRepo from '../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../repo/threads/ThreadCommentsRepo'

export default class AddCommentToThread {
  private readonly _threadsRepo: ThreadsRepo
  private readonly _threadCommentsRepo: ThreadCommentsRepo

  constructor (services: {
    threadsRepo: ThreadsRepo
    threadCommentsRepo: ThreadCommentsRepo
  }) {
    const { threadsRepo, threadCommentsRepo } = services

    this._threadsRepo = threadsRepo
    this._threadCommentsRepo = threadCommentsRepo
  }

  /**
   * Add comment to thread.
   *
   * @throws {HttpError} If thread is not found
   */
  async execute (
    threadId: string, payload: NewComment, owner: string
  ): Promise<AddedComment> {
    if (!isNewComment(payload)) throw HttpError.badRequest('invalid payload')

    await this._threadsRepo.verifyThread(threadId)

    return await this._threadCommentsRepo.addCommentToThread(
      threadId, payload, owner
    )
  }
}

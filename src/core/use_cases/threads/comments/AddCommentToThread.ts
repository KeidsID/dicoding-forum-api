import type AddedComment from 'src/core/entities/threads/comments/AddedComment'
import type NewComment from 'src/core/entities/threads/comments/NewComment'

import type ThreadsRepo from 'src/core/repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from 'src/core/repo/threads/ThreadCommentsRepo'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from 'src/common/error/HttpError'

export default class AddCommentToThreadUseCase {
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
    await this._threadsRepo.verifyThread(threadId)

    return this._threadCommentsRepo.addCommentToThread(
      threadId, payload, owner
    )
  }
}

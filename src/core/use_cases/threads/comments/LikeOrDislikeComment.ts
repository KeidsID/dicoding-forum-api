import type ThreadsRepo from '../../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../../repo/threads/ThreadCommentsRepo'
import type ThreadCommentLikesRepo from '../../../repo/threads/ThreadCommentLikesRepo'

export default class LikeOrDislikeCommentUsecase {
  private readonly _threadsRepo: ThreadsRepo
  private readonly _threadCommentsRepo: ThreadCommentsRepo
  private readonly _threadCommentLikesRepo: ThreadCommentLikesRepo

  constructor (services: {
    threadsRepo: ThreadsRepo
    threadCommentsRepo: ThreadCommentsRepo
    threadCommentLikesRepo: ThreadCommentLikesRepo
  }) {
    this._threadsRepo = services.threadsRepo
    this._threadCommentsRepo = services.threadCommentsRepo
    this._threadCommentLikesRepo = services.threadCommentLikesRepo
  }

  /**
   * Liking a comment if it's not yet liked, and vice versa.
   *
   * @param liker - user id who is liking a comment
   *
   * @throws {HttpError} if thread/comment is not found
   */
  async execute (threadId: string, commentId: string, liker: string): Promise<void> {
    await this._threadsRepo.verifyThread(threadId)
    await this._threadCommentsRepo.verifyCommentLocation(commentId, threadId)

    const isLiked = await this._threadCommentLikesRepo.verifyCommentLike(commentId, liker)

    if (isLiked) {
      await this._threadCommentLikesRepo.dislikeAComment(commentId, liker)
      return
    }

    await this._threadCommentLikesRepo.likeAComment(commentId, liker)
  }
}

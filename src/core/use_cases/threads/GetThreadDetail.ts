// ./src/core/
import type ThreadDetail from '../../entities/threads/ThreadDetail'
import Reply from '../../entities/threads/comments/replies/Reply'
import type ThreadsRepo from '../../repo/threads/ThreadsRepo'
import type ThreadCommentsRepo from '../../repo/threads/ThreadCommentsRepo'
import type ThreadCommentRepliesRepo from '../../repo/threads/ThreadCommentRepliesRepo'

export default class GetThreadDetail {
  private readonly _threadsRepo: ThreadsRepo
  private readonly _threadCommentsRepo: ThreadCommentsRepo
  private readonly _threadCommentRepliesRepo: ThreadCommentRepliesRepo
  constructor (services: {
    threadsRepo: ThreadsRepo
    threadCommentsRepo: ThreadCommentsRepo
    threadCommentRepliesRepo: ThreadCommentRepliesRepo
  }) {
    const {
      threadsRepo,
      threadCommentsRepo,
      threadCommentRepliesRepo
    } = services

    this._threadsRepo = threadsRepo
    this._threadCommentsRepo = threadCommentsRepo
    this._threadCommentRepliesRepo = threadCommentRepliesRepo
  }

  /**
   * Get thread details.
   */
  async execute (threadId: string): Promise<ThreadDetail> {
    const thread = await this._threadsRepo.getThreadById(threadId)
    const rawComments = await this._threadCommentsRepo.getCommentsFromThread(threadId)

    const commentIds = rawComments.map((comment) => comment.id)
    const repliesOfComments = await this._threadCommentRepliesRepo.getRawRepliesFromComments(commentIds)

    const comments = rawComments.map((comment) => {
      const rawReplies = repliesOfComments.filter((rawReply) => rawReply.commentId === comment.id)
      const replies = rawReplies.map((rawReply) => new Reply(rawReply))

      return { ...comment, replies }
    })

    return { ...thread, comments }
  }
}

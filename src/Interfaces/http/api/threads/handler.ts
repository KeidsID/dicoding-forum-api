import type Bottle from 'bottlejs'

import type NewThread from 'src/core/entities/threads/NewThread'
import type NewComment from 'src/core/entities/threads/comments/NewComment'
import type NewReply from 'src/core/entities/threads/comments/replies/NewReply'
import type AddThread from 'src/core/use_cases/threads/AddThread'
import type GetThreadDetail from 'src/core/use_cases/threads/GetThreadDetail'
import type AddCommentToThread from 'src/core/use_cases/threads/comments/AddCommentToThread'
import type SoftDeleteComment from 'src/core/use_cases/threads/comments/SoftDeleteComment'
import type LikeOrDislikeComment from 'src/core/use_cases/threads/comments/LikeOrDislikeComment'
import type AddReplyToComment from 'src/core/use_cases/threads/comments/replies/AddReplyToComment'
import type SoftDeleteReply from 'src/core/use_cases/threads/comments/replies/SoftDeleteReply'
import { type ApiAuthCredentials, type HapiRouteHandler } from 'src/types'

/**
 * Handler for "/threads" endpoint routes.
 *
 * Every handler method are not bind. Use arrow function to prevent undefined `this`
 */
export default class ThreadsHandler {
  private readonly _container: Bottle.IContainer

  constructor (container: Bottle.IContainer) {
    this._container = container
  }

  /**
   * Handler for `POST /threads`.
   */
  postThread: HapiRouteHandler = async (req, h) => {
    const { id: userId } = req.auth.credentials as ApiAuthCredentials

    const addThreadsUseCase: AddThread = this._container.AddThread

    const addedThread = await addThreadsUseCase.execute(
      req.payload as NewThread, userId
    )

    const response = h.response({
      status: 'success',
      data: { addedThread }
    })
    response.code(201)

    return response
  }

  /**
   * Handler for `GET /threads/{threadId}`.
   */
  getThreadDetails: HapiRouteHandler = async (req, h) => {
    const { threadId } = req.params

    const getThreadDetails: GetThreadDetail = this._container.GetThreadDetail

    const thread = await getThreadDetails.execute(threadId)

    return {
      status: 'success',
      data: { thread }
    }
  }

  /**
   * Handler for `POST /threads/{threadId}/comments`.
   */
  postComment: HapiRouteHandler = async (req, h) => {
    const { id: userId } = req.auth.credentials as ApiAuthCredentials
    const { threadId } = req.params

    const addCommentToThread: AddCommentToThread = this._container.AddCommentToThread

    const addedComment = await addCommentToThread.execute(
      threadId, req.payload as NewComment, userId
    )

    const response = h.response({
      status: 'success',
      data: { addedComment }
    })
    response.code(201)

    return response
  }

  /**
   * Handler for `DELETE /threads/{threadId}/comments/{commentId}`.
   */
  deleteComment: HapiRouteHandler = async (req, h) => {
    const { id: userId } = req.auth.credentials as ApiAuthCredentials
    const { threadId, commentId } = req.params

    const softDeleteComment: SoftDeleteComment = this._container.SoftDeleteComment

    await softDeleteComment.execute(threadId, commentId, userId)

    return { status: 'success' }
  }

  /**
   * Handler for `PUT /threads/{threadId}/comments/{commentId}/likes`.
   */
  likeOrDislikeComment: HapiRouteHandler = async (req, h) => {
    const { id: userId } = req.auth.credentials as ApiAuthCredentials
    const { threadId, commentId } = req.params

    const likeOrDislikeComment: LikeOrDislikeComment = this._container.LikeOrDislikeComment

    await likeOrDislikeComment.execute(threadId, commentId, userId)

    return { status: 'success' }
  }

  /**
   * Handler for `POST /threads/{threadId}/comments/{commentId}/replies`.
   */
  postReply: HapiRouteHandler = async (req, h) => {
    const { id: userId } = req.auth.credentials as ApiAuthCredentials
    const { threadId, commentId } = req.params

    const addReplyToComment: AddReplyToComment = this._container
      .AddReplyToComment

    const addedReply = await addReplyToComment.execute(
      threadId, commentId, req.payload as NewReply, userId
    )

    const response = h.response({
      status: 'success',
      data: { addedReply }
    })
    response.code(201)

    return response
  }

  /**
   * Handler for `DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}`.
   */
  deleteReply: HapiRouteHandler = async (req, h) => {
    const { id: userId } = req.auth.credentials as ApiAuthCredentials
    const { threadId, commentId, replyId } = req.params

    const softDeleteReply: SoftDeleteReply = this._container.SoftDeleteReply

    await softDeleteReply.execute(threadId, commentId, replyId, userId)

    return { status: 'success' }
  }
}

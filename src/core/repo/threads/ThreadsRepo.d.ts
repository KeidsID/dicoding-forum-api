import type AddedThread from '../../entities/threads/AddedThread'
import type NewThread from '../../entities/threads/NewThread'
import type Thread from '../../entities/threads/Thread'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HttpError from '../../../common/error/HttpError'

export default interface ThreadsRepo {
  /**
   * Add a new thread into the database.
   */
  addThread: (newThread: NewThread, owner: string) => Promise<AddedThread>

  /**
   * Get thread from database based on provided id.
   *
   * @throws {HttpError} if no thread are found.
   */
  getThreadById: (threadId: string) => Promise<Thread>

  /**
   * Verifies whether a thread exists or not.
   *
   * @throws {HttpError} if thread not exist.
   */
  verifyThread: (threadId: string) => Promise<void>
}

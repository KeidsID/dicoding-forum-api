import type NewThread from 'src/core/entities/threads/NewThread'
import type AddedThread from 'src/core/entities/threads/AddedThread'
import type ThreadsRepo from 'src/core/repo/threads/ThreadsRepo'

export default class AddThread {
  private readonly _threadsRepo: ThreadsRepo

  constructor (services: { threadsRepo: ThreadsRepo }) {
    const { threadsRepo } = services

    this._threadsRepo = threadsRepo
  }

  /**
   * Add a new thread into the database.
   */
  async execute (payload: NewThread, owner: string): Promise<AddedThread> {
    return this._threadsRepo.addThread(payload, owner)
  }
}

/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

class AddThreadUseCase {
  /**
   * @param {object} depedencies
   * @param {ThreadsRepository} depedencies.threadsRepository
   */
  constructor ({ threadsRepository }) {
    this.#threadsRepository = threadsRepository
  }

  #threadsRepository

  /**
   * Add thread to the server database.
   *
   * @param {object} payload
   * @param {string} payload.title
   * @param {string} payload.body
   * @param {string} owner - user id
   *
   * @return {Promise<AddedThread>}
   */
  async execute (payload, owner) {
    const thread = new NewThread(payload)

    return this.#threadsRepository.addThread(thread, owner)
  }
}

module.exports = AddThreadUseCase

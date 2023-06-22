const ThreadsRepository = require('../ThreadsRepository')

describe('ThreadsRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadsRepo = new ThreadsRepository()

    // Action & Assert
    await expect(threadsRepo.addThread({ title: '', body: '' }, ''))
      .rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadsRepo.getThreadById(''))
      .rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadsRepo.verifyThread(''))
      .rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})

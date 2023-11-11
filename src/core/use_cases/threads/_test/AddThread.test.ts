import { mock } from 'ts-jest-mocker'

import type NewThread from 'src/core/entities/threads/NewThread'
import type AddedThread from 'src/core/entities/threads/AddedThread'
import type ThreadsRepo from 'src/core/repo/threads/ThreadsRepo'

import AddThread from '../AddThread'

describe('AddThread use case', () => {
  it('should orchestracting the add thread action correctly', async () => {
    // Arrange
    const payload: NewThread = {
      title: 'A thread',
      body: 'A thread body'
    }
    const owner = 'user-123'

    const mockThreadsRepo = mock<ThreadsRepo>()

    mockThreadsRepo.addThread = jest.fn()
      .mockImplementation(async () => await Promise.resolve({
        id: 'thread-123', title: payload.title, owner
      } satisfies AddedThread))

    const subject = new AddThread({ threadsRepo: mockThreadsRepo })

    // Action
    const addedThread = await subject.execute(payload, owner)

    // Assert
    expect(addedThread).toStrictEqual({
      id: 'thread-123', title: payload.title, owner
    } satisfies AddedThread)

    expect(mockThreadsRepo.addThread).toBeCalledWith(
      payload, owner
    )
  })
})

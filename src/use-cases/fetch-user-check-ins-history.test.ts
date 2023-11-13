import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { InMemoryCheckInsRepository } from '@/repositotories/in-memory/in-memory-check-ins-repository'
import { InMemoryUsersRepository } from '@/repositotories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check Ins History Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
      usersRepository,
    )

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should not be able to fetch check-in history with wrong userId', async () => {
    const promise = sut.execute({
      userId: 'wrong-userId',
      page: 1,
    })

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})

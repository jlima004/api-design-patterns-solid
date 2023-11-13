import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { InMemoryCheckInsRepository } from '@/repositotories/in-memory/in-memory-check-ins-repository'
import { InMemoryUsersRepository } from '@/repositotories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository, usersRepository)

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toEqual(2)
  })

  it('should not be able to fetch check-in history with wrong userId', async () => {
    const promise = sut.execute({
      userId: 'wrong-userId',
    })

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

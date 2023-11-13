import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { hash } from 'bcryptjs'

import { CheckinUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositotories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositotories/in-memory/in-memory-gyms-repository'
import { InMemoryUsersRepository } from '@/repositotories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let usersRepository: InMemoryUsersRepository
let sut: CheckinUseCase

describe('Check-in Use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CheckinUseCase(
      checkInsRepository,
      gymsRepository,
      usersRepository,
    )

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      latitude: -27.5977931,
      longitude: -48.5943292,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    const promise = sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    await expect(promise).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in with wrong userId', async () => {
    const promise = sut.execute({
      userId: 'wrong-userId',
      gymId: 'gym-01',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in with wrong gymId', async () => {
    const promise = sut.execute({
      userId: 'user-01',
      gymId: 'wrong-gymId',
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
    })

    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in on distant gym', async () => {
    const promise = sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.5959769,
      userLongitude: -48.5942773,
    })

    await expect(promise).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

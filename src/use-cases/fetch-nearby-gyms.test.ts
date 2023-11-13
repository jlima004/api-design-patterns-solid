import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositotories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseUseCase(gymsRepository)
  })

  it('shout be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Nearby Gym',
      latitude: -27.5933963,
      longitude: -48.5949141,
    })

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Far Gym',
      latitude: -27.4343451,
      longitude: -48.4415768,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Nearby Gym' })])
  })

  it('shout be able to fetch paginated nearby gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym-${i}`,
        latitude: -27.5933963,
        longitude: -48.5949141,
      })
    }

    const { gyms } = await sut.execute({
      userLatitude: -27.5977931,
      userLongitude: -48.5943292,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym-21' }),
      expect.objectContaining({ title: 'Javascript Gym-22' }),
    ])
  })
})

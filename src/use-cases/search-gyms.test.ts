import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositotories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseUseCase(gymsRepository)
  })

  it('shout be able to search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      latitude: -27.5977931,
      longitude: -48.5943292,
    })

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Typescript Gym',
      latitude: -27.5977931,
      longitude: -48.5943292,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ id: 'gym-01' })])
  })

  it('shout be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym-${i}`,
        latitude: -27.5977931,
        longitude: -48.5943292,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym-21' }),
      expect.objectContaining({ title: 'Javascript Gym-22' }),
    ])
  })
})

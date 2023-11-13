import { expect, describe, it, beforeEach } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryGymsRepository } from '@/repositotories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('shout be able to register a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: new Decimal(-27.5950723),
      longitude: new Decimal(-48.5940098),
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})

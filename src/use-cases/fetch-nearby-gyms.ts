import type { Gym } from '@prisma/client'

import { GymsRepository } from '@/repositotories/gyms-repository'

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  page: number
}

interface FetchNearbyGymsUseUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      userLatitude,
      userLongitude,
      page,
    })

    return {
      gyms,
    }
  }
}

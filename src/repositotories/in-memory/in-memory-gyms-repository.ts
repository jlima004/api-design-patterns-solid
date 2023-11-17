import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import {
  MAX_DISTANCE_GYMS_IN_KILOMETERS,
  PAGINATION_SIZE,
} from '@/shared/constants'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      create_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const Gym = this.items.find((item) => item.id === id)

    return Gym || null
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * PAGINATION_SIZE, page * PAGINATION_SIZE)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.userLatitude, longitude: params.userLongitude },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        )

        return distance <= MAX_DISTANCE_GYMS_IN_KILOMETERS
      })
      .slice((params.page - 1) * PAGINATION_SIZE, params.page * PAGINATION_SIZE)
  }
}

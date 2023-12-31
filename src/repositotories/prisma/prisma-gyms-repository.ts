import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'
import { PAGINATION_SIZE } from '@/shared/constants'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        OR: [
          {
            title: {
              search: query,
            },
          },
          {
            description: {
              search: query,
            },
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['title'],
          search: query,
          sort: 'desc',
        },
      },
      take: PAGINATION_SIZE,
      skip: (page - 1) * PAGINATION_SIZE,
    })

    return gyms
  }

  async findManyNearby({
    userLatitude: latitude,
    userLongitude: longitude,
    page,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * 
      from gyms
    WHERE 
      ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    LIMIT 
      ${PAGINATION_SIZE}
    OFFSET 
      (${page} - 1) * ${PAGINATION_SIZE}
    `

    return gyms
  }
}

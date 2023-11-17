import { FetchNearbyGymsUseUseCase } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositotories/prisma/prisma-gyms-repository'

export function MakeFetchNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseUseCase(gymsRepository)

  return useCase
}

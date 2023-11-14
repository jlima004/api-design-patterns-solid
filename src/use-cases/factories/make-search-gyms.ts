import { SearchGymsUseUseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositotories/prisma/prisma-gyms-repository'

export function MakeSearchGymsInUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseUseCase(gymsRepository)

  return useCase
}

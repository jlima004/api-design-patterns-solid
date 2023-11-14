import { CreateGymUseCase } from '../create-gym'
import { PrismaGymsRepository } from '@/repositotories/prisma/prisma-gyms-repository'

export function MakeCreateGymInUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}

import { PrismaUsersRepository } from '@/repositotories/prisma/prisma-users-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositotories/prisma/prisma-check-ins-repository'

export function MakeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepository, usersRepository)

  return useCase
}

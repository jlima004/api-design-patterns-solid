import { PrismaUsersRepository } from '@/repositotories/prisma/prisma-users-repository'
import { PrismaCheckInsRepository } from '@/repositotories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function MakeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(
    checkInsRepository,
    usersRepository,
  )

  return useCase
}

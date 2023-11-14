import { PrismaUsersRepository } from '@/repositotories/prisma/prisma-users-repository'
import { PrismaCheckInsRepository } from '@/repositotories/prisma/prisma-check-ins-repository'
import { CheckinUseCase } from '../check-in'
import { PrismaGymsRepository } from '@/repositotories/prisma/prisma-gyms-repository'

export function MakeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CheckinUseCase(
    checkInsRepository,
    gymsRepository,
    usersRepository,
  )

  return useCase
}

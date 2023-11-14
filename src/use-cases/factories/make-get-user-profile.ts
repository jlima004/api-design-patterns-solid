import { PrismaUsersRepository } from '@/repositotories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function MakeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}

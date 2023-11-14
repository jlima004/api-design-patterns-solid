import { PrismaCheckInsRepository } from '@/repositotories/prisma/prisma-check-ins-repository'
import { ValidateCheckinUseCase } from '../validate-check-in'

export function MakeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckinUseCase(checkInsRepository)

  return useCase
}

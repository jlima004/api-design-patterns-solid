import { CheckInsRepository } from '@/repositotories/check-ins-repository'
import { UsersRepository } from '@/repositotories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new ResourceNotFoundError()

    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}

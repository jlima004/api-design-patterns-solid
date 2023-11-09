import type { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { UsersRepository } from '@/repositotories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credencials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordsMatches = await compare(password, user.password_hash)

    if (!doesPasswordsMatches) throw new InvalidCredentialsError()

    return { user }
  }
}

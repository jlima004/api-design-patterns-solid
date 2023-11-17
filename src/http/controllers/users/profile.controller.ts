import { FastifyReply, FastifyRequest } from 'fastify'

import { MakeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = MakeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  Reflect.deleteProperty(user, 'password_hash')

  return reply.status(200).send({
    user,
  })
}

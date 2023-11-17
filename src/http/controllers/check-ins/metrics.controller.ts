import { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = MakeGetUserMetricsUseCase()

  let response

  try {
    response = await getUserMetricsUseCase.execute({
      userId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
  }

  if (response === undefined)
    return reply.status(400).send({ message: 'Request error, try again!' })

  const { checkInsCount } = response

  return reply.status(200).send({ checkInsCount })
}

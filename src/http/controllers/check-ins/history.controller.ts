import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { MakeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyGymsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = historyGymsQuerySchema.parse(request.query)

  const fetchUserCheckInsHistoryUseCase = MakeFetchUserCheckInsHistoryUseCase()

  let response

  try {
    response = await fetchUserCheckInsHistoryUseCase.execute({
      userId: request.user.sub,
      page,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  if (response === undefined)
    return reply.status(400).send({ message: 'Request error, try again!' })

  const { checkIns } = response

  return reply.status(200).send({ checkIns })
}

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { MakeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string(),
  })

  const createCheckInBodySchema = z.object({
    userLatitude: z.number().refine((value) => Math.abs(value) <= 90),
    userLongitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
    request.body,
  )

  const checkInUseCase = MakeCheckInUseCase()

  try {
    await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude,
      userLongitude,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      console.log(err)
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof MaxDistanceError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof MaxNumberOfCheckInsError) {
      return reply.status(400).send({ message: err.message })
    }

    return err
  }

  return reply.status(201).send()
}

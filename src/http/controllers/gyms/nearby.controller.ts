import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { MakeFetchNearByGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    page: z.coerce.number().min(1).default(1),
  })

  const { latitude, longitude, page } = nearbyGymsQuerySchema.parse(
    request.query,
  )

  const fetchNearByGymsUseCase = MakeFetchNearByGymsUseCase()

  const { gyms } = await fetchNearByGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    page,
  })

  return reply.status(200).send({ gyms })
}

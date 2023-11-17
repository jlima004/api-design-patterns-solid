import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Validate CheckIn (e2e)', () => {
  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some description.',
        phone: '(48) 9840-6160',
        latitude: -27.5950723,
        longitude: -48.5940098,
      },
    })

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        userLatitude: -27.5950723,
        userLongitude: -48.5940098,
      })

    let checkIn = await prisma.checkIn.findFirstOrThrow()

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', 'Bearer ' + token)

    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findFirstOrThrow()

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})

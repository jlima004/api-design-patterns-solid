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

describe('Create CheckIn (e2e)', () => {
  it('should be able to create a check-in', async () => {
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

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        userLatitude: -27.5950723,
        userLongitude: -48.5940098,
      })

    expect(response.statusCode).toEqual(201)
  })
})

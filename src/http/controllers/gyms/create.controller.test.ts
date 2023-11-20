import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Create Gym (e2e)', () => {
  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Javascript Gym',
        description: 'Some description.',
        phone: '(48) 9840-6160',
        latitude: -27.5950723,
        longitude: -48.5940098,
      })

    expect(response.statusCode).toEqual(201)
  })
})

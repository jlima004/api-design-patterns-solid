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

describe('Nearby Gyms (e2e)', () => {
  it('should be able to list gyms nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Nearby Gym',
        description: 'Some description.',
        phone: '(48) 9840-6160',
        latitude: -27.5933963,
        longitude: -48.5949141,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Far Gym',
        description: 'Some description.',
        phone: '(48) 9840-6160',
        latitude: -27.4343451,
        longitude: -48.4415768,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', 'Bearer ' + token)
      .query({
        latitude: -27.5977931,
        longitude: -48.5943292,
        page: 1,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Nearby Gym',
      }),
    ])
  })
})

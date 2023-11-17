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

describe('Search Gyms (e2e)', () => {
  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Javascript Gym',
        description: 'Some description.',
        phone: '(48) 9840-6160',
        latitude: -27.5950723,
        longitude: -48.5940098,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Typescript Gym',
        description: 'Some description.',
        phone: '(48) 9840-6160',
        latitude: -27.5950723,
        longitude: -48.5940098,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', 'Bearer ' + token)
      .query({
        query: 'Javascript',
        page: 1,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })
})

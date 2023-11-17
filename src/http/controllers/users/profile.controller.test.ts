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

describe('Profile (e2e)', () => {
  it('should be able to get user profile', async () => {
    const { userId, token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', 'Bearer ' + token)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.id).toEqual(userId)
  })
})

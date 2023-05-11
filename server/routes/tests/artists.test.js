const request = require('supertest');
const app = require('../../app');

describe('Artists API Test', () => {
  it('should create a new artist', async () => {
    const res = await request(app)
      .post('/artists')
      .send({
        name: 'artista de prueba',
      })
    expect(res.statusCode).toEqual(201)
  })

  it('should return artists', async () => {
    const res = await request(app)
      .get('/artists')
    expect(res.statusCode).toEqual(200)
  })
})

const request = require('supertest');
const app = require('../../app');

describe('Songs API Test', () => {
  it('should create a new song', async () => {
    const res = await request(app)
      .post('/songs')
      .send({
        title: 'cancion de prueba',
        bpm: 120,
        album_id: 'iddeprueba'
      })
    expect(res.statusCode).toEqual(201)
  })
})

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { buildTestApp } from '../test_common';
import { Connection, Repository } from 'typeorm';

import { v4 as uuid4 } from "uuid";

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection

  beforeAll(async () => {
    app = await buildTestApp();
    connection = app.get(Connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /profile', () => {
    it('should fetch user profile properly', async () => {
      let accessToken = (await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          "email": "amanze@example.com",
          "password": "changeme"
        })
        .expect(201)).body.access_token;

      const { body: profile } = await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(profile.email).toEqual("amanze@example.com");
    });
  });
});
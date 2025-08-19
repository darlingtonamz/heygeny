import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { buildTestApp } from '../test_common';
import { Connection } from 'typeorm';

import {v4 as uuid4} from "uuid";

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection
  let userId = uuid4();
  let userId2 = uuid4();

  beforeAll(async () => {
    app = await buildTestApp();
    connection = app.get(Connection);
    userId = uuid4();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should login properly', async () => {
      const { body: res } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            "email": "amanze@example.com",
            "password": "changeme"
        })
        .expect(201);
      expect(res.access_token).toBeDefined();
      const [headers, payload, signature] = res.access_token.split('.')
        .map((part) => Buffer.from(part, 'base64')
          .toString('utf8'));
      expect(JSON.parse(headers)).toEqual({"alg":"HS256","typ":"JWT"});
      expect(JSON.parse(payload).email).toEqual("amanze@example.com");
      expect(signature).toBeDefined();
    });

    it('should not login properly | with incorrect password', async () => {
      const { body: res } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            "email": "amanze@example.com",
            "password": "bad_password"
        })
        .expect(401);
    });
  });

  describe('POST /auth/register', () => {
    it('should create a new user and login', async () => {
      const { body: res } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
            "email": "amanze2@example.com",
            "password": "changeme",
            "firstName": 'Amanze',
            "lastName": 'Ogbonna',
            "phone": '555-555-5555'
        })
        .expect(201);

        await request(app.getHttpServer())
        .post('/auth/login')
        .send({
            "email": "amanze2@example.com",
            "password": "changeme"
        })
        .expect(201);
    });

    it('should not create a new user with faulty email', async () => {
      const { body: res } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
            "email": "invalid_email",
            "password": "changeme",
            "firstName": 'Amanze',
            "lastName": 'Ogbonna',
            "phone": '555-555-5555'
        })
        .expect(400);
    });
  });
});
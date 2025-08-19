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

  describe('GET /auth/login', () => {
    it('should fetch paginated bookings', async () => {
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
  });
});
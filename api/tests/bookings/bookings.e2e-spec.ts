import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { buildTestApp, createTestUser } from '../test_common';
import { Connection, Repository } from 'typeorm';

import {v4 as uuid4} from "uuid";
import { UserEntity } from '../../src/users/user.entity';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection
  let userId = uuid4();
  let accessToken: string;

  beforeAll(async () => {
    app = await buildTestApp();
    connection = app.get(Connection);

    accessToken = (await request(app.getHttpServer())
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
    userId = profile.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /bookings', () => {
    beforeEach(async () => {
      await connection.query(`INSERT INTO "bookings" ("userId", "serviceType", "bookingDate")
          VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)`,
          [userId, 'test', '2022-01-01', userId, 'test', '2022-01-01', userId, 'test', '2022-01-01'],
      );
    });

    it('should fetch paginated bookings', async () => {
      const { body: res } = await request(app.getHttpServer())
        .get('/bookings')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(res.data.length).toEqual(3);
      expect(res.total).toEqual(3);
      expect(res.count).toEqual(3);
      expect(res.page).toEqual(1);
      expect(res.pageCount).toEqual(1);
    });
  });

  describe('GET /bookings/:id', () => {
    const bookingId1 = uuid4();
    const bookingId2 = uuid4();
    const bookingId3 = uuid4();
    let userX: { user: Partial<UserEntity>, accessToken: string };

    beforeAll(async () => {
      userX = await createTestUser(request(app.getHttpServer()));

      await connection.query(`INSERT INTO "bookings" ("id", "userId", "serviceType", "bookingDate")
          VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
          [bookingId1, userId, 'test', '2022-01-01', bookingId2, userId, 'test', '2022-01-01', bookingId3, userX.user.id, 'test', '2022-01-01'],
      );
    });

    it('should fetch one booking', async () => {
      const { body: booking } = await request(app.getHttpServer())
        .get(`/bookings/${bookingId1}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(booking.id).toEqual(bookingId1);
    });

    it('should not fetch one booking, and retur 404 with unknown bookingId', async () => {
      await request(app.getHttpServer())
        .get(`/bookings/${uuid4()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 with another user\'s bookingId', async () => {
      await request(app.getHttpServer())
        .get(`/bookings/${bookingId3}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('POST /bookings', () => {
    const bookingId1 = uuid4();
    const bookingId2 = uuid4();
    const bookingId3 = uuid4();
    let userX: { user: Partial<UserEntity>, accessToken: string };

    beforeAll(async () => {
      userX = await createTestUser(request(app.getHttpServer()));

      await connection.query(`INSERT INTO "bookings" ("id", "userId", "serviceType", "bookingDate")
          VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
          [bookingId1, userId, 'test', '2022-01-01', bookingId2, userId, 'test', '2022-01-01', bookingId3, userX.user.id, 'test', '2022-01-01'],
      );
    });

    it('should fetch one booking', async () => {
      const { body: booking } = await request(app.getHttpServer())
        .get(`/bookings/${bookingId1}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(booking.id).toEqual(bookingId1);
    });

    it('should not fetch one booking, and retur 404 with unknown bookingId', async () => {
      await request(app.getHttpServer())
        .get(`/bookings/${uuid4()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 with another user\'s bookingId', async () => {
      await request(app.getHttpServer())
        .get(`/bookings/${bookingId3}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
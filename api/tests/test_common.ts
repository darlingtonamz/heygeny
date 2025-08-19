
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from '../src/app.module';
import { Connection, DataSource } from 'typeorm';
import { UserEntity } from '../src/users/user.entity';

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test_user:test_pass@0.0.0.0:5434/test_db'
const datasource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  synchronize: false,
});

export const initTestDB = async () => {
  try {
    console.log('Initializing test database...');
    await datasource.initialize();
    console.log('Database initialized. Running migrations...');
    await datasource.runMigrations();
    console.log('Migrations completed. Database ready for testing...');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export const destroyTestDB = async () => {
  console.log('Destroying test database...');
  await datasource.dropDatabase?.(); // if you want to reset DB completely
  await datasource.destroy();
  console.log('Test Database destroyed...');
}

export const buildTestApp = async () => {
  let app: INestApplication;
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const connection = moduleFixture.get(Connection);
  app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

function generateRandomAlphanumeric(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const createTestUser = async (agent): Promise<{ user: Partial<UserEntity>, accessToken: string }> => {
  const email = `${generateRandomAlphanumeric(10)}@example.com`;
  const { body: user } = await agent
    .post('/auth/register')
    .send({
        email,
        "password": "changeme",
        "firstName": 'Amanze',
        "lastName": 'Ogbonna',
        "phone": '555-555-5555'
    })
    .expect(201);

  const accessToken = (await agent
    .post('/auth/login')
    .send({
        email,
        "password": "changeme"
    })
    .expect(201)).body.access_token;

    return {user, accessToken}
}
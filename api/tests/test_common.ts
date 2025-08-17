
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from '../src/app.module';
import { DataSource } from 'typeorm';

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test_user:test_pass@0.0.0.0:5434/test_db'
const datasource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
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

  app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config(); // loads .env

export default new DataSource({
  type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.POSTGRES_USER || 'postgres',
//   password: process.env.POSTGRES_PASSWORD || 'postgres',
//   database: process.env.POSTGRES_DB || 'test_db',
  url: process.env.DATABASE_URL,
  // entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  // migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
  synchronize: false,
});
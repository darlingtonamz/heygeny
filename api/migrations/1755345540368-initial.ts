import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class Initial1755345540368 implements MigrationInterface {
  async up (queryRunner: QueryRunner): Promise<void> {
    // console.log(QueryRunner);
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
          "id" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
          "email" VARCHAR(255) UNIQUE NOT NULL,
          "passwordHash" VARCHAR(255) NOT NULL,
          "firstName" VARCHAR(100) NOT NULL,
          "lastName" VARCHAR(100) NOT NULL,
          "phone" VARCHAR(20),
          "isActive" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT users_pkey PRIMARY KEY (id)
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
          "id" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
          "name" VARCHAR(50) UNIQUE NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT roles_pkey PRIMARY KEY (id)
      )
    `);

    // Create user_roles junction table
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "userId" UUID NOT NULL,
        "roleId" UUID NOT NULL,
        PRIMARY KEY ("userId", "roleId"),
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE
      )
    `);

    // Create bookings table
    await queryRunner.query(`
      CREATE TABLE "bookings" (
          "id" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
          "userId" UUID NOT NULL,
          "serviceType" VARCHAR(100) NOT NULL,
          "bookingDate" TIMESTAMP NOT NULL,
          "status" VARCHAR(20) DEFAULT 'pending',
          "notes" TEXT,
          "totalAmount" DECIMAL(10,2),
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT bookings_pkey PRIMARY KEY (id),
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Insert default roles
    await queryRunner.query(`
      INSERT INTO "roles" ("name", "description") VALUES
      ('admin', 'Administrator with full access'),
      ('provider', 'Regular user with limited access')
    `);

    // Insert default users
    const passwordHash = await bcrypt.hash('changeme', 10)
    await queryRunner.query(`
      INSERT INTO "users" ("email", "passwordHash", "firstName", "lastName", "phone") VALUES
      ($1, $2, $3, $4, $5)
    `, [
      'amanze@example.com', 
      passwordHash,
      'Amanze', 'Ogbonna', '555-555-5555'
    ]);
  };

  async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "bookings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  };
}

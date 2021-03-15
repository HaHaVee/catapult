import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1615749405087 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    /* table users */
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" text NOT NULL UNIQUE,
        "firstName" text,
        "lastName" text,
        CONSTRAINT "PK_k5vl90b272aade8f830476ff6g9" PRIMARY KEY ("id")
      )`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}

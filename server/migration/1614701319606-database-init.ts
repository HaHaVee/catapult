import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseInit1614701319606 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    /* table gas_meters */
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "gas_meters" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "clientId" uuid, 
        CONSTRAINT "PK_173dbcb272aade8f830476f95bx" PRIMARY KEY ("id")
      )`
    );

    /* table clients */
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "clients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL UNIQUE,
        CONSTRAINT "PK_g4chhab272aade5h830476fhv6e" PRIMARY KEY ("id")
      )`
    );

    /* table gas_meter_readings */
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "gas_meter_readings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "gasMeterId" uuid NOT NULL, 
        "value" smallint NOT NULL,
        "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_46e98db272aade8f830476f9c5e" PRIMARY KEY ("id")
      )`
    );

    await queryRunner.query(
      `ALTER TABLE "gas_meters" ADD CONSTRAINT "FK_hv33dd7417d4ab4d8d4319716g8" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL`
    );

    await queryRunner.query(
      `ALTER TABLE "gas_meter_readings" ADD CONSTRAINT "FK_15c3dd7417d44e6d8d431971106" FOREIGN KEY ("gasMeterId") REFERENCES "gas_meters"("id") ON DELETE CASCADE`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    `DROP TABLE IF EXISTS "gas_meters"`;
    `DROP TABLE IF EXISTS "clients"`;
    `DROP TABLE IF EXISTS "gas_meter_readings"`;
  }
}

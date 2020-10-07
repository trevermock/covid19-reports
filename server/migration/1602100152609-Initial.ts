import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1602100152609 implements MigrationInterface {
  name = 'Initial1602100152609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "org" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "description" character varying(2048) NOT NULL, "index_prefix" character varying NOT NULL DEFAULT '', "contact_id" character varying(10) NOT NULL, CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(2048) NOT NULL, "description" character varying(2048) NOT NULL, "index_prefix" character varying NOT NULL DEFAULT '', "allowed_roster_columns" character varying NOT NULL DEFAULT '', "allowed_notification_events" character varying NOT NULL DEFAULT '', "can_manage_group" boolean NOT NULL DEFAULT false, "can_manage_roster" boolean NOT NULL DEFAULT false, "can_view_roster" boolean NOT NULL DEFAULT false, "can_view_muster" boolean NOT NULL DEFAULT false, "can_view_pii" boolean NOT NULL DEFAULT false, "can_manage_workspace" boolean NOT NULL DEFAULT false, "org_id" integer NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "user" ("edipi" character varying(10) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "service" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "root_admin" boolean NOT NULL DEFAULT false, "is_registered" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f2d7df953fa9efab0ce105ee24d" PRIMARY KEY ("edipi"))`);
    await queryRunner.query(`CREATE TABLE "roster" ("edipi" character varying(10) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "unit" character varying(50) NOT NULL, "billet_workcenter" character varying(50) NOT NULL, "contract_number" character varying(100) NOT NULL, "rate_rank" character varying(100), "pilot" boolean, "aircrew" boolean, "cdi" boolean, "cdqar" boolean, "dscacrew" boolean, "advanced_party" boolean, "pui" boolean, "covid19_test_return_date" TIMESTAMP, "rom" character varying(50), "rom_release" character varying(100), "last_reported" TIMESTAMP DEFAULT null, "org_id" integer NOT NULL, CONSTRAINT "PK_6d3bc54502350051de7e30cfb91" PRIMARY KEY ("edipi", "org_id"))`);
    await queryRunner.query(`CREATE TYPE "access_request_status_enum" AS ENUM('pending', 'denied')`);
    await queryRunner.query(`CREATE TABLE "access_request" ("id" SERIAL NOT NULL, "request_date" TIMESTAMP NOT NULL DEFAULT now(), "status" "access_request_status_enum" NOT NULL DEFAULT 'pending', "user_edipi" character varying(10), "org_id" integer, CONSTRAINT "PK_a543250cab0b6d2eb3a85593d93" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "user_roles" ("user" character varying(10) NOT NULL, "role" integer NOT NULL, CONSTRAINT "PK_949caf046fc278bd72bd4cbef84" PRIMARY KEY ("user", "role"))`);
    await queryRunner.query(`CREATE INDEX "IDX_781a1c15149789c1609fe1b025" ON "user_roles" ("user") `);
    await queryRunner.query(`CREATE INDEX "IDX_0475850442d60bd704c5804155" ON "user_roles" ("role") `);
    await queryRunner.query(`ALTER TABLE "org" ADD CONSTRAINT "FK_0630c49a2a4170cc7c1513ba38b" FOREIGN KEY ("contact_id") REFERENCES "user"("edipi") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD CONSTRAINT "FK_309a26a4130d531a5c0c80e915f" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_781a1c15149789c1609fe1b0258" FOREIGN KEY ("user") REFERENCES "user"("edipi") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_0475850442d60bd704c58041551" FOREIGN KEY ("role") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_0475850442d60bd704c58041551"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_781a1c15149789c1609fe1b0258"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP CONSTRAINT "FK_309a26a4130d531a5c0c80e915f"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c"`);
    await queryRunner.query(`ALTER TABLE "org" DROP CONSTRAINT "FK_0630c49a2a4170cc7c1513ba38b"`);
    await queryRunner.query(`DROP INDEX "IDX_0475850442d60bd704c5804155"`);
    await queryRunner.query(`DROP INDEX "IDX_781a1c15149789c1609fe1b025"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "access_request"`);
    await queryRunner.query(`DROP TYPE "access_request_status_enum"`);
    await queryRunner.query(`DROP TABLE "roster"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "org"`);
  }

}

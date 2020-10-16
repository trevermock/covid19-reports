import {MigrationInterface, QueryRunner} from "typeorm";

export class CustomRosterColumns1602714133159 implements MigrationInterface {
    name = 'CustomRosterColumns1602714133159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "custom_roster_column_type_enum" AS ENUM('string', 'boolean', 'date', 'number')`);
        await queryRunner.query(`CREATE TABLE "custom_roster_column" ("name" character varying NOT NULL, "display" character varying(100) NOT NULL, "type" "custom_roster_column_type_enum" NOT NULL DEFAULT 'string', "pii" boolean NOT NULL DEFAULT false, "phi" boolean NOT NULL DEFAULT false, "required" boolean NOT NULL DEFAULT false, "org_id" integer NOT NULL, CONSTRAINT "PK_955ee15c9a38fb185f7fb9a55b8" PRIMARY KEY ("name", "org_id"))`);
        await queryRunner.query(`ALTER TABLE "roster" ADD "custom_columns" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "role" ADD "can_view_phi" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "custom_roster_column" ADD CONSTRAINT "FK_fb53158e089b64e4c88c1e1ad18" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_roster_column" DROP CONSTRAINT "FK_fb53158e089b64e4c88c1e1ad18"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "can_view_phi"`);
        await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "custom_columns"`);
        await queryRunner.query(`DROP TABLE "custom_roster_column"`);
        await queryRunner.query(`DROP TYPE "custom_roster_column_type_enum"`);
    }

}

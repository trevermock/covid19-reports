import { MigrationInterface, QueryRunner } from 'typeorm';
import { WorkspaceTemplate } from '../api/workspace/workspace-template.model';
import { kibanaSavedObjectsMock } from '../kibana/kibana-saved-objects.mock';

export class Workspaces1602287934964 implements MigrationInterface {
  name = 'Workspaces1602287934964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "workspace_template" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "pii" boolean NOT NULL, "phi" boolean NOT NULL, "kibana_saved_objects" text NOT NULL, CONSTRAINT "PK_cffbc7d1606ac418b10ce9bab12" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "pii" boolean NOT NULL, "phi" boolean NOT NULL, "org_id" integer NOT NULL, "workspace_template_id" integer, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "role" ADD "workspace_id" integer`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "allowed_roster_columns"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "allowed_roster_columns" text NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "allowed_notification_events"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "allowed_notification_events" text NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_a5498b79ec16741b57e976105ee" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_a55d0d92d3dbbff75445a7cb824" FOREIGN KEY ("workspace_template_id") REFERENCES "workspace_template"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_79824a434de2b4547a1be0c759a" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);

    // Create workspace templates
    const workspaceTemplateRepo = queryRunner.manager.getRepository(WorkspaceTemplate);
    await workspaceTemplateRepo.insert([{
      name: 'Symptom Tracking (Non-PII)',
      description: 'Symptom tracker without PII data',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.nonPii,
    }, {
      name: 'Symptom Tracking (PII)',
      description: 'Symptom tracker with PII data',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.pii,
    }]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_79824a434de2b4547a1be0c759a"`);
    await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_a55d0d92d3dbbff75445a7cb824"`);
    await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_a5498b79ec16741b57e976105ee"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "allowed_notification_events"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "allowed_notification_events" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "allowed_roster_columns"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "allowed_roster_columns" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "workspace_id"`);
    await queryRunner.query(`DROP TABLE "workspace"`);
    await queryRunner.query(`DROP TABLE "workspace_template"`);
  }

}

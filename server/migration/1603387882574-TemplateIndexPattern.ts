import { MigrationInterface, QueryRunner } from 'typeorm';
import { WorkspaceTemplate } from '../api/workspace/workspace-template.model';
import { kibanaSavedObjectsMock } from '../kibana/kibana-saved-objects.mock';

export class TemplateIndexPattern1603387882574 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const workspaceTemplateRepo = queryRunner.manager.getRepository(WorkspaceTemplate);
    const existingTemplates = await workspaceTemplateRepo.find();
    await workspaceTemplateRepo.remove(existingTemplates);
    await workspaceTemplateRepo.insert([{
      name: 'Symptom Tracking (Non-PII)',
      description: 'A symptom tracking workspace that does not include Personally Identifiable Information (PII).',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.nonPii,
    }, {
      name: 'Symptom Tracking (PII)',
      description: 'A symptom tracking workspace that includes Personally Identifiable Information (PII).',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.pii,
    }, {
      name: 'Symptom Tracking (PHI)',
      description: 'A symptom tracking workspace that includes Protected Health Information (PHI).',
      pii: true,
      phi: true,
      kibanaSavedObjects: kibanaSavedObjectsMock.phi,
    }]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}

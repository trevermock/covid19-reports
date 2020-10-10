import { Role } from '../api/role/role.model';
import { Workspace } from '../api/workspace/workspace.model';
import { KibanaApi } from './kibana-api';

export async function setupKibanaWorkspace(workspace: Workspace, role: Role, kibanaApi: KibanaApi) {
  if (!workspace.workspaceTemplate) {
    throw new Error('createKibanaWorkspace requires a workspace.workspaceTemplate to be set.');
  }

  const savedObjects = [] as KibanaSavedObject[];
  for (const savedObjectRaw of workspace.workspaceTemplate.kibanaSavedObjects) {
    savedObjects.push({
      id: savedObjectRaw._id,
      type: savedObjectRaw._type,
      attributes: savedObjectRaw._source,
    });
  }

  await kibanaApi.axios.post('/api/saved_objects/_bulk_create', savedObjects);
}

interface KibanaSavedObject {
  id: string
  type: string
  attributes: any
}

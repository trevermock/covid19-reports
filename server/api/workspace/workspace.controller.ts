import { Response } from 'express';
import { getConnection } from 'typeorm';
import { KibanaApi } from '../../kibana/kibana-api';
import { setupKibanaWorkspace } from '../../kibana/kibana-utility';
import {
  ApiRequest, OrgParam, OrgWorkspaceParams,
} from '../index';
import { Workspace } from './workspace.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import { WorkspaceTemplate } from './workspace-template.model';
import { Role } from '../role/role.model';

class WorkspaceController {

  async getOrgWorkspaces(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const workspaces = await Workspace.find({
      relations: ['workspaceTemplate'],
      where: {
        org: req.appOrg.id,
      },
      order: {
        id: 'ASC',
      },
    });

    res.json(workspaces);
  }

  async getOrgWorkspaceTemplates(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const templates = await WorkspaceTemplate.find({
      select: ['id', 'name', 'description', 'pii', 'phi'],
      order: {
        id: 'ASC',
      },
    });

    res.json(templates);
  }

  async addWorkspace(req: ApiRequest<OrgParam, WorkspaceBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    if (!req.appRole) {
      throw new NotFoundError('req.appRole is not set');
    }

    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a workspace.');
    }

    if (!req.body.description) {
      throw new BadRequestError('A description must be supplied when adding a workspace.');
    }

    if (!req.body.templateId) {
      throw new BadRequestError('A base template must be supplied when adding a workspace.');
    }

    const workspace = new Workspace();
    workspace.org = req.appOrg;
    const template = await WorkspaceTemplate.findOne({
      where: {
        id: req.body.templateId,
      },
    });

    if (!template) {
      throw new NotFoundError('Workspace template could not be found.');
    }

    workspace.workspaceTemplate = template;
    workspace.pii = template.pii;
    workspace.phi = template.phi;
    await setWorkspaceFromBody(workspace, req.body);

    let newWorkspace = undefined as Workspace | undefined;
    await getConnection().transaction(async manager => {
      newWorkspace = await manager.save(workspace);
      req.appWorkspace = newWorkspace;

      // Create new Kibana workspace.
      // NOTE: We can't connect to the Kibana API with middleware when creating a workspace, since the workspace
      // doesn't exist yet to build the JWT with. So connect manually now that it exists.
      await KibanaApi.connect(req);
      await setupKibanaWorkspace(newWorkspace, req.appRole!, req.kibanaApi!);
    });

    await res.status(201).json(newWorkspace);
  }

  async getWorkspace(req: ApiRequest<OrgWorkspaceParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const workspaceId = parseInt(req.params.workspaceId);

    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId,
        org: req.appOrg.id,
      },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace could not be found.');
    }

    res.json(workspace);
  }

  async deleteWorkspace(req: ApiRequest<OrgWorkspaceParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const workspaceId = parseInt(req.params.workspaceId);

    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId,
        org: req.appOrg.id,
      },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace could not be found.');
    }

    const roles = await Role.count({
      where: {
        workspace: workspaceId,
      },
    });

    if (roles > 0) {
      throw new BadRequestError('Cannot delete a workspace that is assigned to a role.');
    }

    const removedWorkspace = await workspace.remove();
    res.json(removedWorkspace);
  }

  async updateWorkspace(req: ApiRequest<OrgWorkspaceParams, WorkspaceBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }
    const workspaceId = parseInt(req.params.workspaceId);

    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId,
        org: req.appOrg.id,
      },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace could not be found.');
    }

    await setWorkspaceFromBody(workspace, req.body);

    const updatedWorkspace = await workspace.save();

    res.json(updatedWorkspace);
  }

}

async function setWorkspaceFromBody(workspace: Workspace, body: WorkspaceBody) {
  if (body.name != null) {
    workspace.name = body.name;
  }
  if (body.description != null) {
    workspace.description = body.description;
  }
}

type WorkspaceBody = {
  name?: string
  description?: string
  templateId?: number
};

export default new WorkspaceController();

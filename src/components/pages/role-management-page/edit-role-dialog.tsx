import React, { useState } from 'react';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, Select,
  TableCell,
  TableRow, TextField, Typography,
} from '@material-ui/core';
import axios from 'axios';
import useStyles from './edit-role-dialog.styles';
import { ApiRole, ApiRosterColumnInfo, ApiWorkspace } from '../../../models/api-response';
import {
  allNotificationEvents,
} from '../../../models/notification-events';
import {
  RolePermissions, parsePermissions, permissionsToArray,
} from '../../../utility/permission-set';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';

export interface EditRoleDialogProps {
  open: boolean,
  orgId?: number,
  role?: ApiRole,
  rosterColumns?: ApiRosterColumnInfo[],
  workspaces?: ApiWorkspace[],
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditRoleDialog = (props: EditRoleDialogProps) => {
  const classes = useStyles();

  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, role, workspaces, rosterColumns, onClose, onError,
  } = props;

  const existingRole: boolean = !!role;
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [indexPrefix, setIndexPrefix] = useState(role?.indexPrefix || '');
  const [workspaceId, setWorkspaceId] = useState(role?.workspace?.id || -1);
  const [allowedRosterColumns, setAllowedRosterColumns] = useState(parsePermissions(rosterColumns || [], role?.allowedRosterColumns));
  const [allowedNotificationEvents, setAllowedNotificationEvents] = useState(parsePermissions(allNotificationEvents, role?.allowedNotificationEvents));
  const [canManageGroup, setCanManageGroup] = useState(role ? role.canManageGroup : false);
  const [canManageRoster, setCanManageRoster] = useState(role ? role.canManageRoster : false);
  const [canManageWorkspace, setCanManageWorkspace] = useState(role ? role.canManageWorkspace : false);
  const [canViewRoster, setCanViewRoster] = useState(role ? role.canViewRoster : false);
  const [canViewMuster, setCanViewMuster] = useState(role ? role.canViewMuster : false);
  const [canViewPII, setCanViewPII] = useState(role ? role.canViewPII : false);
  const [canViewPHI, setCanViewPHI] = useState(role ? role.canViewPHI : false);
  const [saveRoleLoading, setSaveRoleLoading] = useState(false);

  if (!open) {
    return <></>;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onPermissionChanged = (func: (f: boolean) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.checked);
  };

  const onWorkspaceChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newWorkspaceId = parseInt(event.target.value as string);
    const selectedWorkspace = workspaces?.find(workspace => workspace.id === newWorkspaceId);
    if (selectedWorkspace && rosterColumns) {
      const allowedColumns: RolePermissions = {};
      rosterColumns.forEach(column => {
        allowedColumns[column.name] = (!column.pii || selectedWorkspace.pii) && (!column.phi || selectedWorkspace.phi);
      });
      if (selectedWorkspace.pii) {
        setCanViewPII(true);
      }
      if (selectedWorkspace.phi) {
        setCanViewPHI(true);
      }
      setAllowedRosterColumns(allowedColumns);
    }
    setWorkspaceId(newWorkspaceId);
  };

  const getWorkspaceDescription = () => {
    const selectedWorkspace = workspaces?.find(workspace => {
      return workspace.id === workspaceId;
    });
    return selectedWorkspace?.description || 'No workspace, users with this role will not have access to analytics dashboards.';
  };

  const onRosterColumnChanged = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowedRosterColumns(previous => {
      const newState = { ...previous };
      newState[property] = event.target.checked;
      return newState;
    });
  };

  const onNotificationEventChanged = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowedNotificationEvents(previous => {
      const newState = { ...previous };
      newState[property] = event.target.checked;
      return newState;
    });
  };

  const filterAllowedRosterColumns = (viewMuster: boolean) => {
    const allowedColumns: RolePermissions = {};
    rosterColumns!.forEach(column => {
      const allowed = columnAllowed(column);
      const previousValue = allowedRosterColumns[column.name];
      allowedColumns[column.name] = previousValue && allowed;
    });
    allowedColumns.lastReported = viewMuster;
    return allowedColumns;
  };

  const onSave = async () => {
    setSaveRoleLoading(true);
    setFormDisabled(true);
    const viewMuster = canManageGroup || canViewMuster;
    const allowedColumns = filterAllowedRosterColumns(viewMuster);
    const body = {
      name,
      description,
      indexPrefix,
      workspaceId: workspaceId < 0 ? null : workspaceId,
      allowedRosterColumns: permissionsToArray(allowedColumns),
      allowedNotificationEvents: permissionsToArray(allowedNotificationEvents),
      canManageGroup,
      canManageRoster: canManageGroup || canManageRoster,
      canManageWorkspace: canManageGroup || canManageWorkspace,
      canViewRoster: canManageGroup || canManageRoster || canViewRoster,
      canViewMuster: viewMuster,
      canViewPII: canViewPII || canViewPHI,
      canViewPHI,
    };
    try {
      if (existingRole) {
        await axios.put(`api/role/${orgId}/${role!.id}`, body);
      } else {
        await axios.post(`api/role/${orgId}`, body);
      }
    } catch (error) {
      if (onError) {
        let message = 'Internal Server Error';
        if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          message = error.response.data.errors[0].message;
        }
        onError(message);
      }
      setFormDisabled(false);
      return;
    }
    setSaveRoleLoading(false);
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    return !formDisabled && name.length > 0 && description.length > 0;
  };

  const columnAllowed = (column: ApiRosterColumnInfo) => {
    return (!column.pii || canViewPII || canViewPHI) && (!column.phi || canViewPHI);
  };

  const buildRosterColumnRows = () => {
    const columns = rosterColumns?.filter(column => column.name !== 'lastReported');
    return columns?.map(column => (
      <TableRow key={column.name}>
        <TableCell>
          {column.displayName}
        </TableCell>
        <TableCell>
          <Checkbox
            color="primary"
            disabled={formDisabled || !columnAllowed(column) || workspaceId >= 0}
            checked={allowedRosterColumns[column.name] && columnAllowed(column)}
            onChange={onRosterColumnChanged(column.name)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  const buildNotificationEventRows = () => {
    return allNotificationEvents.map(event => (
      <TableRow key={event.name}>
        <TableCell>
          {event.displayName}
        </TableCell>
        <TableCell>
          <Checkbox
            color="primary"
            disabled={formDisabled}
            checked={allowedNotificationEvents[event.name]}
            onChange={onNotificationEventChanged(event.name)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRole ? 'Edit Role' : 'New Role'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Role Name:</Typography>
            <TextField
              className={classes.textField}
              id="role-name"
              disabled={formDisabled}
              value={name}
              onChange={onInputChanged(setName)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Description:</Typography>
            <TextField
              className={classes.textField}
              id="role-description"
              disabled={formDisabled}
              multiline
              rowsMax={2}
              value={description}
              onChange={onInputChanged(setDescription)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Analytics Workspace:</Typography>
            <Select
              className={classes.workspaceSelect}
              native
              disabled={formDisabled}
              value={workspaceId}
              onChange={onWorkspaceChanged}
              inputProps={{
                name: 'template',
                id: 'template-select',
              }}
            >
              <option key={-1} value={-1}>None</option>
              {workspaces && workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Workspace Description:</Typography>
            <Typography className={classes.workspaceDescription}>{getWorkspaceDescription()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Unit Filter:</Typography>
            <TextField
              className={classes.textField}
              id="role-index-prefix"
              disabled={formDisabled}
              value={indexPrefix}
              onChange={onInputChanged(setIndexPrefix)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Allowed Notifications:</Typography>
            <EditableBooleanTable aria-label="Notifications">
              {buildNotificationEventRows()}
            </EditableBooleanTable>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>
              {`Viewable Roster Columns: ${workspaceId >= 0 ? '(Set by Workspace)' : ''}`}
            </Typography>
            <EditableBooleanTable aria-label="Roster Columns">
              {buildRosterColumnRows()}
            </EditableBooleanTable>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Permissions:</Typography>
            <EditableBooleanTable aria-label="Permissions">
              <TableRow>
                <TableCell>Manage Group</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled}
                    checked={canManageGroup}
                    onChange={onPermissionChanged(setCanManageGroup)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Manage Roster</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || canManageGroup}
                    checked={canManageGroup || canManageRoster}
                    onChange={onPermissionChanged(setCanManageRoster)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Manage Workspace</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || canManageGroup}
                    checked={canManageGroup || canManageWorkspace}
                    onChange={onPermissionChanged(setCanManageWorkspace)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>View Roster</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || canManageGroup || canManageRoster}
                    checked={canManageGroup || canManageRoster || canViewRoster}
                    onChange={onPermissionChanged(setCanViewRoster)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>View Muster Reports</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || canManageGroup}
                    checked={canManageGroup || canViewMuster}
                    onChange={onPermissionChanged(setCanViewMuster)}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  {`View PII ${workspaceId >= 0 ? '(Set by Workspace)' : ''}`}
                </TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || workspaceId >= 0 || canViewPHI}
                    checked={canViewPII || canViewPHI}
                    onChange={onPermissionChanged(setCanViewPII)}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  {`View PHI ${workspaceId >= 0 ? '(Set by Workspace)' : ''}`}
                </TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || workspaceId >= 0}
                    checked={canViewPHI}
                    onChange={onPermissionChanged(setCanViewPHI)}
                  />
                </TableCell>
              </TableRow>
            </EditableBooleanTable>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.roleDialogActions}>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner
          disabled={!canSave()}
          onClick={onSave}
          color="primary"
          loading={saveRoleLoading}
        >
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};

import React, { useState } from 'react';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table, TableBody, TableCell,
  TableRow, TextField, Typography,
} from '@material-ui/core';
import axios from 'axios';
import useStyles from './edit-role-dialog.styles';
import { ApiRole } from '../../../models/api-response';
import { AllowedRosterColumns, RosterColumnDisplayName, RosterPIIColumns } from '../../../models/roster-columns';
import { AllowedNotificationEvents, NotificationEventDisplayName } from '../../../models/notification-events';
import { parsePermissions, permissionsToString } from '../../../utility/permission-set';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

export interface EditRoleDialogProps {
  open: boolean,
  orgId?: number,
  role?: ApiRole,
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditRoleDialog = (props: EditRoleDialogProps) => {
  const classes = useStyles();

  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, role, onClose, onError,
  } = props;

  const existingRole: boolean = !!role;
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [indexPrefix, setIndexPrefix] = useState(role?.indexPrefix || '');
  const [allowedRosterColumns, setAllowedRosterColumns] = useState(parsePermissions(new AllowedRosterColumns(), role?.allowedRosterColumns));
  const [allowedNotificationEvents, setAllowedNotificationEvents] = useState(parsePermissions(new AllowedNotificationEvents(), role?.allowedNotificationEvents));
  const [canManageGroup, setCanManageGroup] = useState(role ? role.canManageGroup : false);
  const [canManageRoster, setCanManageRoster] = useState(role ? role.canManageRoster : false);
  const [canManageWorkspace, setCanManageWorkspace] = useState(role ? role.canManageWorkspace : false);
  const [canViewRoster, setCanViewRoster] = useState(role ? role.canViewRoster : false);
  const [canViewMuster, setCanViewMuster] = useState(role ? role.canViewMuster : false);
  const [canViewPII, setCanViewPII] = useState(role ? role.canViewPII : false);
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

  const onRosterColumnChanged = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowedRosterColumns(previous => {
      const newState = { ...previous };
      Reflect.set(newState, property, event.target.checked);
      return newState;
    });
  };

  const onNotificationEventChanged = (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowedNotificationEvents(previous => {
      const newState = { ...previous };
      Reflect.set(newState, property, event.target.checked);
      return newState;
    });
  };

  const filterAllowedRosterColumns = (viewPII: boolean, viewMuster: boolean) => {
    const allowedColumns = new AllowedRosterColumns();
    Object.keys(allowedRosterColumns).forEach(column => {
      const allowed = columnAllowed(column, viewPII);
      const previousValue = Reflect.get(allowedRosterColumns, column);
      Reflect.set(allowedColumns, column, previousValue && allowed);
    });
    allowedColumns.lastReported = viewMuster;
    return allowedColumns;
  };

  const onSave = async () => {
    setSaveRoleLoading(true);
    setFormDisabled(true);
    const viewPII = canManageGroup || canViewPII;
    const viewMuster = canManageGroup || canViewMuster;
    const allowedColumns = filterAllowedRosterColumns(viewPII, viewMuster);
    const body = {
      name,
      description,
      indexPrefix,
      allowedRosterColumns: permissionsToString(allowedColumns),
      allowedNotificationEvents: permissionsToString(allowedNotificationEvents),
      canManageGroup,
      canManageRoster: canManageGroup || canManageRoster,
      canManageWorkspace: canManageGroup || canManageWorkspace,
      canViewRoster: canManageGroup || canManageRoster || canViewRoster,
      canViewMuster: viewMuster,
      canViewPII: viewPII,
    };
    try {
      if (existingRole) {
        await axios.put(`api/role/${orgId}/${role!.id}`, body);
      } else {
        await axios.post(`api/role/${orgId}`, body);
      }
    } catch (error) {
      console.log(error, onError);
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

  const columnAllowed = (column: string, viewPII: boolean) => {
    return !Reflect.get(RosterPIIColumns, column) || viewPII;
  };

  const buildRosterColumnRows = () => {
    const viewPII = canManageGroup || canViewPII;
    const columns = Object.keys(allowedRosterColumns).filter(column => column !== 'lastReported');
    return columns.map(column => (
      <TableRow key={column}>
        <TableCell className={classes.textCell}>
          {Reflect.get(RosterColumnDisplayName, column) || 'Unknown'}
        </TableCell>
        <TableCell className={classes.iconCell}>
          <Checkbox
            color="primary"
            disabled={formDisabled || !columnAllowed(column, viewPII)}
            checked={Reflect.get(allowedRosterColumns, column) && columnAllowed(column, viewPII)}
            onChange={onRosterColumnChanged(column)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  const buildNotificationEventRows = () => {
    return Object.keys(allowedNotificationEvents).map(event => (
      <TableRow key={event}>
        <TableCell className={classes.textCell}>
          {Reflect.get(NotificationEventDisplayName, event) || 'Unknown'}
        </TableCell>
        <TableCell className={classes.iconCell}>
          <Checkbox
            color="primary"
            disabled={formDisabled}
            checked={Reflect.get(allowedNotificationEvents, event)}
            onChange={onNotificationEventChanged(event)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
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
            <Typography className={classes.roleHeader}>Index Prefix:</Typography>
            <TextField
              className={classes.textField}
              id="role-index-prefix"
              disabled={formDisabled}
              value={indexPrefix}
              onChange={onInputChanged(setIndexPrefix)}
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
            <Typography className={classes.roleHeader}>Allowed Notifications:</Typography>
            <div className={classes.tableScroll}>
              <Table aria-label="Notifications" className={classes.roleTable}>
                <TableBody>
                  {buildNotificationEventRows()}
                </TableBody>
              </Table>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Viewable Roster Columns:</Typography>
            <div className={classes.tableScroll}>
              <Table aria-label="Roster Columns" className={classes.roleTable}>
                <TableBody>
                  {buildRosterColumnRows()}
                </TableBody>
              </Table>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.roleHeader}>Permissions:</Typography>
            <div className={classes.tableScroll}>
              <Table aria-label="Permissions" className={classes.roleTable}>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.textCell}>Manage Group</TableCell>
                    <TableCell className={classes.iconCell}>
                      <Checkbox
                        color="primary"
                        disabled={formDisabled}
                        checked={canManageGroup}
                        onChange={onPermissionChanged(setCanManageGroup)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.textCell}>Manage Roster</TableCell>
                    <TableCell className={classes.iconCell}>
                      <Checkbox
                        color="primary"
                        disabled={formDisabled || canManageGroup}
                        checked={canManageGroup || canManageRoster}
                        onChange={onPermissionChanged(setCanManageRoster)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.textCell}>Manage Workspace</TableCell>
                    <TableCell className={classes.iconCell}>
                      <Checkbox
                        color="primary"
                        disabled={formDisabled || canManageGroup}
                        checked={canManageGroup || canManageWorkspace}
                        onChange={onPermissionChanged(setCanManageWorkspace)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.textCell}>View Roster</TableCell>
                    <TableCell className={classes.iconCell}>
                      <Checkbox
                        color="primary"
                        disabled={formDisabled || canManageGroup || canManageRoster}
                        checked={canManageGroup || canManageRoster || canViewRoster}
                        onChange={onPermissionChanged(setCanViewRoster)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.textCell}>View Muster Reports</TableCell>
                    <TableCell className={classes.iconCell}>
                      <Checkbox
                        color="primary"
                        disabled={formDisabled || canManageGroup}
                        checked={canManageGroup || canViewMuster}
                        onChange={onPermissionChanged(setCanViewMuster)}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className={classes.textCell}>View PII</TableCell>
                    <TableCell className={classes.iconCell}>
                      <Checkbox
                        color="primary"
                        disabled={formDisabled || canManageGroup}
                        checked={canManageGroup || canViewPII}
                        onChange={onPermissionChanged(setCanViewPII)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
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

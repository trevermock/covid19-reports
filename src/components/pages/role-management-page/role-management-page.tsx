import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText, Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Divider, AccordionActions,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import CheckIcon from '@material-ui/icons/Check';
import useStyles from './role-management-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiRole, ApiWorkspace, ApiRosterColumnInfo } from '../../../models/api-response';
import {
  AllNotificationEvents,
} from '../../../models/notification-events';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';
import { EditRoleDialog, EditRoleDialogProps } from './edit-role-dialog';
import { parsePermissions, RolePermissions } from '../../../utility/permission-set';
import { AppFrame } from '../../../actions/app-frame.actions';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

interface ParsedRoleData {
  allowedRosterColumns: RolePermissions,
  allowedNotificationEvents: RolePermissions,
}


export const RoleManagementPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedRoleIndex, setSelectedRoleIndex] = useState(-1);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [roleData, setRoleData] = useState<ParsedRoleData[]>([]);
  const [rosterColumns, setRosterColumns] = useState<ApiRosterColumnInfo[]>([]);
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([]);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [editRoleDialogProps, setEditRoleDialogProps] = useState<EditRoleDialogProps>({ open: false });
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const initializeTable = React.useCallback(async () => {
    dispatch(AppFrame.setPageLoading(true));
    const orgRoles = (await axios.get(`api/role/${orgId}`)).data as ApiRole[];
    const orgWorkspaces = (await axios.get(`api/workspace/${orgId}`)).data as ApiWorkspace[];
    const orgRosterColumns = (await axios.get(`api/roster/${orgId}/fullinfo`)).data as ApiRosterColumnInfo[];
    const parsedRoleData = orgRoles.map(role => {
      return {
        allowedRosterColumns: parsePermissions(orgRosterColumns, role.allowedRosterColumns),
        allowedNotificationEvents: parsePermissions(AllNotificationEvents, role.allowedNotificationEvents),
      };
    });
    setRoleData(parsedRoleData);
    setWorkspaces(orgWorkspaces);
    setRosterColumns(orgRosterColumns);
    setRoles(orgRoles);
    dispatch(AppFrame.setPageLoading(false));
  }, [orgId]);

  const cancelDeleteRoleDialog = () => {
    setDeleteRoleDialogOpen(false);
  };

  const newRole = async () => {
    setEditRoleDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditRoleDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Add Role',
          message: `Unable to add role: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const editRole = async () => {
    const selectedRole = roles[selectedRoleIndex];
    setEditRoleDialogProps({
      open: true,
      orgId,
      role: selectedRole,
      onClose: async () => {
        setEditRoleDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Edit Role',
          message: `Unable to edit role: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const deleteRole = async () => {
    setDeleteRoleLoading(true);
    try {
      await axios.delete(`api/role/${orgId}/${roles[selectedRoleIndex].id}`);
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'Delete Role',
        message: `Unable to delete role: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    }
    setDeleteRoleLoading(false);
    setDeleteRoleDialogOpen(false);
    await initializeTable();
  };

  const handleRoleChange = (index: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setSelectedRoleIndex(isExpanded ? index : -1);
  };

  const buildRosterColumnRows = (index: number) => {
    if (index >= roleData.length) {
      return <></>;
    }
    const viewableColumns = roleData[index].allowedRosterColumns;
    return rosterColumns.map(column => (
      <TableRow key={column.name}>
        <TableCell className={classes.textCell}>
          {column.displayName}
        </TableCell>
        <TableCell className={classes.iconCell}>
          {viewableColumns[column.name] && (
            <CheckIcon />
          )}
        </TableCell>
      </TableRow>
    ));
  };

  const buildNotificationEventRows = (index: number) => {
    if (index >= roleData.length) {
      return <></>;
    }
    const allowedEvents = roleData[index].allowedNotificationEvents;
    return AllNotificationEvents.map(event => (
      <TableRow key={event.name}>
        <TableCell className={classes.textCell}>
          {event.displayName}
        </TableCell>
        <TableCell className={classes.iconCell}>
          {allowedEvents[event.name] && (
            <CheckIcon />
          )}
        </TableCell>
      </TableRow>
    ));
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <Grid container>
          <Grid item xs={6}>
            <h1>Group Roles</h1>
          </Grid>
          <Grid className={classes.newRole} item xs={6}>
            <Button
              color="primary"
              onClick={newRole}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Role
            </Button>
          </Grid>
        </Grid>
        <div className={classes.accordionHeader}>
          <Typography>Role Name</Typography>
          <Typography>Unit Filter</Typography>
          <Typography>Analytics Workspace</Typography>
        </div>
        {roles.map((row, index) => (
          <Accordion
            key={row.id}
            className={classes.roleAccordion}
            expanded={selectedRoleIndex === index}
            onChange={handleRoleChange(index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={`role${row.id}_header`}
            >
              <Typography className={classes.nameColumn}>{row.name}</Typography>
              <Typography className={classes.indexPrefixColumn}>{row.indexPrefix}</Typography>
              <Typography>{row.workspace ? row.workspace.name : 'None'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography className={classes.roleHeader}>Description:</Typography>
                  <Typography>{row.description}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.roleHeader}>Allowed Notifications:</Typography>
                  <div className={classes.tableScroll}>
                    <Table aria-label="Notifications" className={classes.roleTable}>
                      <TableBody>
                        {buildNotificationEventRows(index)}
                      </TableBody>
                    </Table>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.roleHeader}>Viewable Roster Columns:</Typography>
                  <div className={classes.tableScroll}>
                    <Table aria-label="Roster Columns" className={classes.roleTable}>
                      <TableBody>
                        {buildRosterColumnRows(index)}
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
                            {row.canManageGroup && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.textCell}>Manage Roster</TableCell>
                          <TableCell className={classes.iconCell}>
                            {row.canManageRoster && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.textCell}>Manage Workspace</TableCell>
                          <TableCell className={classes.iconCell}>
                            {row.canManageWorkspace && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.textCell}>View Roster</TableCell>
                          <TableCell className={classes.iconCell}>
                            {row.canViewRoster && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.textCell}>View Muster Reports</TableCell>
                          <TableCell className={classes.iconCell}>
                            {row.canViewMuster && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className={classes.textCell}>View PII</TableCell>
                          <TableCell className={classes.iconCell}>
                            {row.canViewPII && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.textCell}>View PII</TableCell>
                          <TableCell className={classes.iconCell}>
                            {row.canViewPHI && (
                              <CheckIcon />
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Grid>
              </Grid>
            </AccordionDetails>
            <Divider />
            <AccordionActions className={classes.roleButtons}>
              <Button
                color="primary"
                onClick={editRole}
              >
                Edit Role
              </Button>
              <Button
                className={classes.deleteRoleButton}
                onClick={() => setDeleteRoleDialogOpen(true)}
                variant="outlined"
              >
                Delete Role
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </Container>
      {deleteRoleDialogOpen && (
        <Dialog
          open={deleteRoleDialogOpen}
          onClose={cancelDeleteRoleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Role</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${roles[selectedRoleIndex].name}' role?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonWithSpinner
              onClick={deleteRole}
              loading={deleteRoleLoading}
            >
              Yes
            </ButtonWithSpinner>
            <Button onClick={cancelDeleteRoleDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editRoleDialogProps.open && (
        <EditRoleDialog
          open={editRoleDialogProps.open}
          orgId={editRoleDialogProps.orgId}
          role={editRoleDialogProps.role}
          workspaces={workspaces}
          rosterColumns={rosterColumns}
          onClose={editRoleDialogProps.onClose}
          onError={editRoleDialogProps.onError}
        />
      )}
      {alertDialogProps.open && (
        <AlertDialog
          open={alertDialogProps.open}
          title={alertDialogProps.title}
          message={alertDialogProps.message}
          onClose={alertDialogProps.onClose}
        />
      )}
    </main>
  );
};

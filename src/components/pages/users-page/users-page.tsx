import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton, FormControl, InputLabel, Select,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import useStyles from './users-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiRole, ApiUser, ApiAccessRequest } from '../../../models/api-response';
import { AppFrame } from '../../../actions/app-frame.actions';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

interface AccessRequestRow extends ApiAccessRequest {
  waiting?: boolean,
}

export const UsersPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formDisabled, setFormDisabled] = useState(false);
  const [activeAccessRequest, setActiveAccessRequest] = useState<AccessRequestRow | undefined>();
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [availableRoles, setAvailableRoles] = useState<ApiRole[]>([]);
  const [userRows, setUserRows] = useState<ApiUser[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequestRow[]>([]);
  const [finalizeApprovalLoading, setFinalizeApprovalLoading] = useState<boolean>(false);
  const [denyRequestsLoading, setDenyRequestsLoading] = useState({} as ({[rowId: number]: boolean}));
  const [alert, setAlert] = useState({ open: false, message: '', title: '' });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const initializeTable = React.useCallback(async () => {
    dispatch(AppFrame.setPageLoading(true));
    const users = (await axios.get(`api/user/${orgId}`)).data as ApiUser[];
    const requests = (await axios.get(`api/access-request/${orgId}`)).data as AccessRequestRow[];
    const roles = (await axios.get(`api/role/${orgId}`)).data as ApiRole[];
    setUserRows(users);
    setAccessRequests(requests);
    setAvailableRoles(roles);
    dispatch(AppFrame.setPageLoading(false));
  }, [orgId]);

  function updateDenyRequestLoading(rowId: number, isLoading: boolean) {
    const denyRequestsLoadingClone = { ...denyRequestsLoading };
    denyRequestsLoadingClone[rowId] = isLoading;
    setDenyRequestsLoading(denyRequestsLoadingClone);
  }

  function selectedRoleChanged(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedRole(event.target.value as number);
  }

  function cancelRoleSelection() {
    setAccessRequests(requests => {
      return requests.map(request => {
        if (request.id === activeAccessRequest?.id) {
          request.waiting = false;
        }
        return request;
      });
    });
    setActiveAccessRequest(undefined);
  }

  async function acceptRoleSelection() {
    setFinalizeApprovalLoading(true);
    setFormDisabled(true);
    if (activeAccessRequest) {
      await axios.post(`api/access-request/${orgId}/approve`, {
        requestId: activeAccessRequest.id,
        roleId: availableRoles[selectedRole].id,
      });
    }
    await initializeTable();
    setFinalizeApprovalLoading(false);
    setActiveAccessRequest(undefined);
  }

  function acceptRequest(id: number) {
    setAccessRequests(requests => {
      return requests.map(request => {
        if (request.id === id) {
          request.waiting = true;
        }
        return request;
      });
    });
    const request = accessRequests.find(req => req.id === id);
    if (request) {
      setActiveAccessRequest(request);
    }
  }

  async function denyRequest(id: number) {
    updateDenyRequestLoading(id, true);
    setAccessRequests(requests => {
      return requests.map(request => {
        if (request.id === id) {
          request.waiting = true;
        }
        return request;
      });
    });
    await axios.post(`api/access-request/${orgId}/deny`, {
      requestId: id,
    });
    updateDenyRequestLoading(id, false);
    await initializeTable();
  }

  const handleAlertClose = () => {
    setAlert({ open: false, message: '', title: '' });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <h1>Users</h1>
        {accessRequests.length > 0 && (
          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  <TableCell colSpan={6}>
                    <h2>Access Requests</h2>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>EDIPI</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accessRequests.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {`${row.user.firstName} ${row.user.lastName}`}
                    </TableCell>
                    <TableCell>{row.user.edipi}</TableCell>
                    <TableCell>{row.user.service}</TableCell>
                    <TableCell>
                      <IconButton aria-label="expand row" size="small" href={`mailto:${row.user.email}`}>
                        <MailOutlineIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.user.phone}</TableCell>
                    <TableCell className={classes.accessRequestButtons}>
                      <Button
                        variant="contained"
                        disabled={row.waiting}
                        className={classes.accessRequestApproveButton}
                        onClick={() => { acceptRequest(row.id); }}
                      >
                        Approve
                      </Button>
                      <ButtonWithSpinner
                        variant="contained"
                        disabled={row.waiting}
                        className={classes.accessRequestDenyButton}
                        onClick={async () => { await denyRequest(row.id); }}
                        loading={denyRequestsLoading[row.id]}
                      >
                        Deny
                      </ButtonWithSpinner>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell colSpan={6}>
                  <h2>All Users</h2>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>EDIPI</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRows.map(row => (
                <TableRow key={row.edipi}>
                  <TableCell component="th" scope="row">
                    {`${row.firstName} ${row.lastName}`}
                  </TableCell>
                  <TableCell>{row.edipi}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>
                    <IconButton aria-label="expand row" size="small" href={`mailto:${row.email}`}>
                      <MailOutlineIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.roles ? row.roles[0].name : 'Unknown'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog onClose={cancelRoleSelection} open={activeAccessRequest != null}>
        <DialogContent>
          <DialogContentText align="center" color="textPrimary">
            Please assign <b>{`${activeAccessRequest?.user.firstName} ${activeAccessRequest?.user.lastName}`}</b> a role:
          </DialogContentText>
          <FormControl className={classes.roleSelect}>
            <InputLabel htmlFor="role-select">Role</InputLabel>
            <Select
              native
              disabled={formDisabled}
              autoFocus
              value={selectedRole}
              onChange={selectedRoleChanged}
              inputProps={{
                name: 'role',
                id: 'role-select',
              }}
            >
              {availableRoles.map((role, index) => (
                <option key={role.id} value={index}>{role.name}</option>
              ))}
            </Select>
          </FormControl>
          {availableRoles.length > selectedRole && (
            <>
              <DialogContentText color="textPrimary" className={classes.roleDescription}>
                {availableRoles[selectedRole].description}
              </DialogContentText>
              <Table aria-label="Permissions">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.rolePermissionHeader}>Permission</TableCell>
                    <TableCell className={classes.rolePermissionHeader}>Allowed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.rolePermissionCell}>Manage Group</TableCell>
                    <TableCell className={classes.rolePermissionIconCell}>
                      {availableRoles[selectedRole].canManageGroup && (
                        <CheckIcon />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.rolePermissionCell}>Manage Roster</TableCell>
                    <TableCell className={classes.rolePermissionIconCell}>
                      {availableRoles[selectedRole].canManageRoster && (
                        <CheckIcon />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.rolePermissionCell}>Manage Workspace</TableCell>
                    <TableCell className={classes.rolePermissionIconCell}>
                      {availableRoles[selectedRole].canManageWorkspace && (
                        <CheckIcon />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.rolePermissionCell}>View Roster</TableCell>
                    <TableCell className={classes.rolePermissionIconCell}>
                      {availableRoles[selectedRole].canViewRoster && (
                        <CheckIcon />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.rolePermissionCell}>View Muster Reports</TableCell>
                    <TableCell className={classes.rolePermissionIconCell}>
                      {availableRoles[selectedRole].canViewMuster && (
                        <CheckIcon />
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className={classes.rolePermissionCell}>View PII</TableCell>
                    <TableCell className={classes.rolePermissionIconCell}>
                      {availableRoles[selectedRole].canViewPII && (
                        <CheckIcon />
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions className={classes.roleDialogActions}>
          <Button disabled={formDisabled} variant="outlined" onClick={cancelRoleSelection} color="primary">
            Cancel
          </Button>
          <ButtonWithSpinner
            disabled={formDisabled}
            onClick={acceptRoleSelection}
            color="primary"
            loading={finalizeApprovalLoading}
          >
            Finalize Approval
          </ButtonWithSpinner>
        </DialogActions>
      </Dialog>
      <Dialog
        open={alert.open}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{alert.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alert.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

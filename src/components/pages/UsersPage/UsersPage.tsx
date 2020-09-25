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
  IconButton, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import axios from 'axios';
import useStyles from './UsersPage.styles';
import { UserState } from '../../../reducers/userReducer';
import { AppState } from '../../../store';

interface UserRole {
  name: string,
}

interface UserRow {
  edipi: string,
  first_name: string,
  last_name: string,
  service: string,
  phone: string,
  email: string,
  roles: UserRole[],
}

interface Role {
  id: number,
  name: string,
  description: string,
  index_prefix: string,
  can_manage_users: boolean,
  can_manage_roster: boolean,
  can_manage_roles: boolean,
  can_manage_dashboards: boolean,
  can_view_roster: boolean,
  can_view_muster: boolean,
  notify_on_access_request: boolean,
}

interface AccessRequestRow {
  id: number,
  request_date: Date,
  user: UserRow,
  waiting?: boolean,
}

export const UsersPage = () => {
  const classes = useStyles();

  const [formDisabled, setFormDisabled] = useState(false);
  const [activeAccessRequest, setActiveAccessRequest] = useState<AccessRequestRow | undefined>();
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRows, setUserRows] = useState<UserRow[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequestRow[]>([]);
  const [alert, setAlert] = useState({ open: false, message: '', title: '' });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org.id;

  async function initializeTable() {
    const users = (await axios.get(`api/user/${orgId}`)).data as UserRow[];
    const requests = (await axios.get(`api/access-request/${orgId}`)).data as AccessRequestRow[];
    const roles = (await axios.get(`api/role/${orgId}`)).data as Role[];
    setUserRows(users);
    setAccessRequests(requests);
    setAvailableRoles(roles);
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
    setFormDisabled(true);
    if (activeAccessRequest) {
      await axios.post(`api/access-request/${orgId}/approve`, {
        requestId: activeAccessRequest.id,
        roleId: availableRoles[selectedRole].id,
      });
    }
    await initializeTable();
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

  async function rejectRequest(id: number) {
    setAccessRequests(requests => {
      return requests.map(request => {
        if (request.id === id) {
          request.waiting = true;
        }
        return request;
      });
    });
    await axios.post(`api/access-request/${orgId}/reject`, {
      requestId: id,
    });
    await initializeTable();
  }

  const handleAlertClose = () => {
    setAlert({ open: false, message: '', title: '' });
  };

  useEffect(() => { initializeTable().then(); }, []);

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
                      {`${row.user.first_name} ${row.user.last_name}`}
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
                      <Button
                        variant="contained"
                        disabled={row.waiting}
                        className={classes.accessRequestRejectButton}
                        onClick={async () => { await rejectRequest(row.id); }}
                      >
                        Reject
                      </Button>
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
                    {`${row.first_name} ${row.last_name}`}
                  </TableCell>
                  <TableCell>{row.edipi}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>
                    <IconButton aria-label="expand row" size="small" href={`mailto:${row.email}`}>
                      <MailOutlineIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.roles[0].name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog onClose={cancelRoleSelection} open={activeAccessRequest != null}>
        <DialogContent className={classes.roleDialog}>
          <DialogContentText>
            Please assign <b>{`${activeAccessRequest?.user.first_name} ${activeAccessRequest?.user.last_name}`}</b> a role:
          </DialogContentText>
          <form noValidate>
            <FormControl>
              <InputLabel htmlFor="max-width">Role</InputLabel>
              <Select
                disabled={formDisabled}
                autoFocus
                value={selectedRole}
                onChange={selectedRoleChanged}
              >
                {availableRoles.map((role, index) => (
                  <MenuItem value={index}>{role.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={formDisabled} variant="outlined" onClick={cancelRoleSelection} color="primary">
            Cancel
          </Button>
          <Button disabled={formDisabled} onClick={acceptRoleSelection} color="primary">
            Finalize Approval
          </Button>
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

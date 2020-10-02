import {
  Button, Card, CardActions, CardContent, Container, IconButton, Menu, MenuItem, Paper, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography,
} from '@material-ui/core';
import { MailOutline, PersonAdd, MoreVert } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { StatusChip } from '../../status-chip/status-chip';
import useStyles from './groups-page.styles';
import { ApiAccessRequest, ApiOrg } from '../../../models/api-response';

export const GroupsPage = () => {
  const classes = useStyles();
  const user = useSelector<AppState, UserState>(state => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(!user.activeRole);
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(true);
  const [accessRequests, setAccessRequests] = useState([] as ApiAccessRequest[]);
  const [allOrgs, setAllOrgs] = useState([] as ApiOrg[]);
  const [requestAccessOrgs, setRequestAccessOrgs] = useState([] as ApiOrg[]);
  const [myOrgMenuAnchor, setMyOrgMenuAnchor] = useState(null as HTMLElement | null);
  const [myOrgMenuOrg, setMyOrgMenuOrg] = useState(null as MyOrg | null);

  async function fetchAllOrgs() {
    const response = await axios.get('api/org') as AxiosResponse<ApiOrg[]>;
    setAllOrgs(response.data);
  }

  async function fetchAccessRequests() {
    const response = await axios.get('api/user/access-requests') as AxiosResponse<ApiAccessRequest[]>;
    setAccessRequests(response.data);
  }

  function handleRequestAccessClick(org: ApiOrg) {
    requestAccess(org).then();
  }

  async function requestAccess(org: ApiOrg) {
    const response = await axios.post(`api/access-request/${org.id}`) as AxiosResponse<ApiAccessRequest>;
    const newRequest = response.data;

    // If we already have a request for this org, replace it. Otherwise, add the new request.
    const existingIndex = accessRequests.findIndex(req => req.org.id === newRequest.org.id);
    const accessRequestsUpdated = [...accessRequests];
    if (existingIndex !== -1) {
      accessRequestsUpdated[existingIndex] = newRequest;
    } else {
      accessRequestsUpdated.push(newRequest);
    }

    setAccessRequests(accessRequestsUpdated);
  }

  async function cancelRequest(org: MyOrg) {
    await axios.post(`api/access-request/${org.id}/cancel`);
    const accessRequestsUpdated = [...accessRequests];
    const index = accessRequests.findIndex(req => req.org.id === org.id);
    if (index !== -1) {
      accessRequestsUpdated.splice(index, 1);
      setAccessRequests(accessRequestsUpdated);
    }
  }

  function handleCancelRequestClick(org: MyOrg) {
    closeMyOrgMenu();
    cancelRequest(org).then();
  }

  function handleResubmitRequestClick(org: MyOrg) {
    closeMyOrgMenu();
    requestAccess(org).then();
  }

  function getStatusLabel(org: MyOrg) {
    if (org.accessRequest) {
      return org.accessRequest.status;
    }

    const role = user.roles!.find(r => r.org!.id === org.id);
    return role!.name;
  }

  function getStatusColor(org: MyOrg) {
    const status = org.accessRequest ? org.accessRequest.status : 'approved';

    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'denied':
        return 'error';
      default:
        throw new Error(`Unknown access request status "${status}"`);
    }
  }

  function getMyOrgs() {
    // Build list of orgs we're in or have made access requests to.
    const userOrgs = user.roles!.map(role => ({
      id: role.org!.id,
      name: role.org!.name,
      contact: role.org!.contact,
    })) as MyOrg[];

    const accessReqs = accessRequests.map(req => ({
      ...req.org,
      accessRequest: req,
    })) as MyOrg[];

    return userOrgs
      .concat(accessReqs)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function isMyOrgMenuOpen(org: MyOrg) {
    return (myOrgMenuOrg != null && myOrgMenuOrg.id === org.id);
  }

  function closeMyOrgMenu() {
    setMyOrgMenuAnchor(null);
    setMyOrgMenuOrg(null);
  }

  function handleMyOrgMenuOpen(e: React.MouseEvent<HTMLElement>, org: MyOrg) {
    setMyOrgMenuAnchor(e.currentTarget);
    setMyOrgMenuOrg(org);
  }

  useEffect(() => {
    // Initial load.
    async function fetchData() {
      await Promise.all([
        fetchAllOrgs(),
        fetchAccessRequests(),
      ]);

      // Finish loading.
      setIsLoading(false);
    }

    fetchData().then();
  }, []);

  useEffect(() => {
    // Build a filtered list of orgs the user can request access to.
    const myOrgsLookup = {} as {[orgId: number]: boolean};

    // Filter orgs we have access requests for.
    for (const accessRequest of accessRequests) {
      myOrgsLookup[accessRequest.org.id] = true;
    }

    // Filter orgs that we're already in.
    const userRoles = user.roles || [];
    for (const role of userRoles) {
      myOrgsLookup[role.org!.id] = true;
    }

    setRequestAccessOrgs(
      allOrgs
        .filter(org => !myOrgsLookup[org.id])
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  }, [allOrgs, accessRequests]);

  if (isLoading) {
    // TODO: Show loading spinner.
    return <>Loading...</>;
  }

  const myOrgs = getMyOrgs();

  return (
    <>
      <Container maxWidth="md">
        <header>
          <h1>Groups</h1>
        </header>

        {/* My Groups */}
        {(myOrgs.length > 0) && (
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle" component="div">
                My Groups
              </Typography>
            </Toolbar>

            <TableContainer>
              <Table size="small" aria-label="my groups table">
                <TableHead>
                  <TableRow>
                    <TableCell>Group Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell className={classes.emailHeader}>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myOrgs.map(org => (
                    <TableRow key={org.id}>
                      <TableCell component="th" scope="row">
                        {org.name}
                      </TableCell>
                      <TableCell>{`${org.contact!.firstName} ${org.contact!.lastName}`}</TableCell>
                      <TableCell>
                        <IconButton href={`mailto:${org.contact!.email}`} target="_blank" aria-label="email">
                          <MailOutline />
                        </IconButton>
                      </TableCell>
                      <TableCell>{org.contact!.phone}</TableCell>
                      <TableCell>
                        <StatusChip
                          label={getStatusLabel(org)}
                          color={getStatusColor(org)}
                        />
                      </TableCell>
                      {org.accessRequest ? (
                        <TableCell align="right" padding="none">
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={e => handleMyOrgMenuOpen(e, org)}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            open={isMyOrgMenuOpen(org)}
                            onClose={closeMyOrgMenu}
                            anchorEl={myOrgMenuAnchor}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          >
                            <MenuItem onClick={() => handleCancelRequestClick(org)}>
                              Cancel Request
                            </MenuItem>

                            {org.accessRequest.status === 'denied' && (
                              <MenuItem onClick={() => handleResubmitRequestClick(org)}>
                                Resubmit Request
                              </MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      ) : (
                        <TableCell align="right" padding="none" />
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Info Card */}
        {(!user.activeRole && accessRequests.length === 0 && isInfoCardVisible) && (
          <Card className={classes.infoCard} variant="outlined">
            <CardContent className={classes.infoCardContent}>
              <header>
                <div>You are not a member of any groups.</div>
                <p>
                  In order to use StatusEngine and view data, you must first belong to a group. Joining a group is easy.
                  Simply follow these three steps and you’ll be on your way in no time!
                </p>
              </header>

              <div className={classes.infoCardStepList}>
                <div className={classes.infoCardStep}>
                  <div>
                    <span className={classes.infoCardStepNumber}>
                      1
                    </span>
                  </div>
                  <div>Find your group(s) using the table below.</div>
                </div>
                <div className={classes.infoCardStep}>
                  <div>
                    <span className={classes.infoCardStepNumber}>
                      2
                    </span>
                  </div>
                  <div>Use the Request Access button to send an access request to the group’s contact.</div>
                </div>
                <div className={classes.infoCardStep}>
                  <div>
                    <span className={classes.infoCardStepNumber}>
                      3
                    </span>
                  </div>
                  <div>Keep track of your access requests, status, and joined groups via this page.</div>
                </div>
              </div>

              <CardActions>
                <Button size="large" onClick={() => setIsInfoCardVisible(false)}>
                  Ok, I got it
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        )}

        {/* Request Access */}
        {(requestAccessOrgs.length > 0) && (
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography variant="h6" id="tableTitle" component="div">
                Request Access
              </Typography>
            </Toolbar>
            <TableContainer>
              <Table size="small" aria-label="request access table">
                <TableHead>
                  <TableRow>
                    <TableCell>Group Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell className={classes.emailHeader}>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestAccessOrgs.map(org => (
                    <TableRow key={org.name}>
                      <TableCell component="th" scope="row">
                        {org.name}
                      </TableCell>
                      <TableCell>{`${org.contact!.firstName} ${org.contact!.lastName}`}</TableCell>
                      <TableCell>
                        <IconButton href={`mailto:${org.contact!.email}`} target="_blank" aria-label="email">
                          <MailOutline />
                        </IconButton>
                      </TableCell>
                      <TableCell>{org.contact!.phone}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          startIcon={<PersonAdd />}
                          onClick={() => handleRequestAccessClick(org)}
                        >
                          Request Access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      <Snackbar
        open={isAlertVisible}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setIsAlertVisible(false)}
      >
        <Alert onClose={() => setIsAlertVisible(false)} severity="success" variant="filled">
          You have successfully registered and logged in!
        </Alert>
      </Snackbar>
    </>
  );
};

interface MyOrg extends ApiOrg {
  accessRequest?: ApiAccessRequest
}

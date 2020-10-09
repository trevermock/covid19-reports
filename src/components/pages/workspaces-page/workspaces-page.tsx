import {
  Button,
  Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Menu, MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckIcon from '@material-ui/icons/Check';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useStyles from './workspaces-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiWorkspace, ApiWorkspaceTemplate } from '../../../models/api-response';
import { EditWorkspaceDialog, EditWorkspaceDialogProps } from './edit-workspace-dialog';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';

interface WorkspaceMenuState {
  anchor: HTMLElement | null,
  workspace?: ApiWorkspace,
}

export const WorkspacesPage = () => {
  const classes = useStyles();
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([]);
  const [workspaceTemplates, setWorkspaceTemplates] = useState<ApiWorkspaceTemplate[]>([]);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<null | ApiWorkspace>(null);
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [editWorkspaceDialogProps, setEditWorkspaceDialogProps] = useState<EditWorkspaceDialogProps>({ open: false });
  const [workspaceMenu, setWorkspaceMenu] = React.useState<WorkspaceMenuState>({ anchor: null });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const initializeTable = React.useCallback(async () => {
    const ws = (await axios.get(`api/workspace/${orgId}`)).data as ApiWorkspace[];
    const templates = (await axios.get(`api/workspace/${orgId}/templates`)).data as ApiWorkspaceTemplate[];
    setWorkspaces(ws);
    setWorkspaceTemplates(templates);
  }, [orgId]);

  const newWorkspace = async () => {
    setEditWorkspaceDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditWorkspaceDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Add Workspace',
          message: `Unable to add workspace: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const editWorkspace = () => {
    if (workspaceMenu.workspace) {
      const workspace = workspaceMenu.workspace;
      setWorkspaceMenu({ anchor: null });
      setEditWorkspaceDialogProps({
        open: true,
        workspace,
        orgId,
        onClose: async () => {
          setEditWorkspaceDialogProps({ open: false });
          await initializeTable();
        },
        onError: (message: string) => {
          setAlertDialogProps({
            open: true,
            title: 'Edit Workspace',
            message: `Unable to edit workspace: ${message}`,
            onClose: () => { setAlertDialogProps({ open: false }); },
          });
        },
      });
    }
  };

  const deleteWorkspace = () => {
    if (workspaceMenu.workspace) {
      const workspace = workspaceMenu.workspace;
      setWorkspaceMenu({ anchor: null });
      setWorkspaceToDelete(workspace);
    }
  };

  const confirmDeleteWorkspace = async () => {
    if (!workspaceToDelete) {
      return;
    }
    try {
      await axios.delete(`api/workspace/${orgId}/${workspaceToDelete.id}`);
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      }
      setAlertDialogProps({
        open: true,
        title: 'Delete Workspace',
        message: `Unable to delete workspace: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    }
    setWorkspaceToDelete(null);
    await initializeTable();
  };

  const cancelDeleteWorkspaceDialog = () => {
    setWorkspaceToDelete(null);
  };

  const handleWorkspaceMenuClick = (workspace: ApiWorkspace) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setWorkspaceMenu({ anchor: event.currentTarget, workspace });
  };

  const handleWorkspaceMenuClose = () => {
    setWorkspaceMenu({ anchor: null });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <Grid container>
          <Grid item xs={6}>
            <h1>Workspaces</h1>
          </Grid>
          <Grid className={classes.newWorkspace} item xs={6}>
            <Button
              color="primary"
              onClick={newWorkspace}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Workspace
            </Button>
          </Grid>
        </Grid>
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="workspaces table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell className={classes.iconCell}>PII</TableCell>
                <TableCell className={classes.iconCell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {workspaces.map(workspace => (
                <TableRow key={workspace.id}>
                  <TableCell component="th" scope="row">{workspace.name}</TableCell>
                  <TableCell>{workspace.description}</TableCell>
                  <TableCell className={classes.iconCell}>
                    {workspace.pii && (
                      <CheckIcon />
                    )}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    <IconButton
                      aria-label="workspace actions"
                      aria-controls={`workspace-${workspace.id}-menu`}
                      aria-haspopup="true"
                      onClick={handleWorkspaceMenuClick(workspace)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <Menu
                id="workspace-menu"
                anchorEl={workspaceMenu.anchor}
                keepMounted
                open={Boolean(workspaceMenu.workspace)}
                onClose={handleWorkspaceMenuClose}
              >
                <MenuItem onClick={editWorkspace}>Edit Workspace</MenuItem>
                <MenuItem onClick={deleteWorkspace}>Delete Workspace</MenuItem>
              </Menu>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {Boolean(workspaceToDelete) && (
        <Dialog
          open={Boolean(workspaceToDelete)}
          onClose={cancelDeleteWorkspaceDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Workspace</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${workspaceToDelete?.name}' workspace?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteWorkspace}>
              Yes
            </Button>
            <Button onClick={cancelDeleteWorkspaceDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editWorkspaceDialogProps.open && (
        <EditWorkspaceDialog
          open={editWorkspaceDialogProps.open}
          orgId={editWorkspaceDialogProps.orgId}
          workspace={editWorkspaceDialogProps.workspace}
          templates={workspaceTemplates}
          onClose={editWorkspaceDialogProps.onClose}
          onError={editWorkspaceDialogProps.onError}
        />
      )}
      {alertDialogProps.open && (
        <AlertDialog open={alertDialogProps.open} title={alertDialogProps.title} message={alertDialogProps.message} onClose={alertDialogProps.onClose} />
      )}
    </main>
  );
};

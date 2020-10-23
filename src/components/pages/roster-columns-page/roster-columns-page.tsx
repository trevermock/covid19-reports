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
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useStyles from './roster-columns-page.styles';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import { ApiRosterColumnInfo } from '../../../models/api-response';
import { AlertDialog, AlertDialogProps } from '../../alert-dialog/alert-dialog';
import { EditColumnDialog, EditColumnDialogProps } from './edit-column-dialog';
import { AppFrame } from '../../../actions/app-frame.actions';

interface ColumnMenuState {
  anchor: HTMLElement | null,
  column?: ApiRosterColumnInfo,
}

export const RosterColumnsPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<ApiRosterColumnInfo[]>([]);
  const [columnToDelete, setColumnToDelete] = useState<null | ApiRosterColumnInfo>(null);
  const [alertDialogProps, setAlertDialogProps] = useState<AlertDialogProps>({ open: false });
  const [editColumnDialogProps, setEditColumnDialogProps] = useState<EditColumnDialogProps>({ open: false });
  const [columnMenu, setColumnMenu] = React.useState<ColumnMenuState>({ anchor: null });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org?.id;

  const initializeTable = React.useCallback(async () => {
    try {
      dispatch(AppFrame.setPageLoading(true));
      const allColumns = (await axios.get(`api/roster/${orgId}/column`)).data as ApiRosterColumnInfo[];
      const customColumns = allColumns.filter(column => column.custom);
      setColumns(customColumns);
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      } else {
        console.log(error);
      }
      setAlertDialogProps({
        open: true,
        title: 'Initialize Custom Columns Page',
        message: `Failed to initialize the custom columns page: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    } finally {
      dispatch(AppFrame.setPageLoading(false));
    }
  }, [orgId, dispatch]);

  const newColumn = async () => {
    setEditColumnDialogProps({
      open: true,
      orgId,
      onClose: async () => {
        setEditColumnDialogProps({ open: false });
        await initializeTable();
      },
      onError: (message: string) => {
        setAlertDialogProps({
          open: true,
          title: 'Add Column',
          message: `Unable to add column: ${message}`,
          onClose: () => { setAlertDialogProps({ open: false }); },
        });
      },
    });
  };

  const editColumn = () => {
    if (columnMenu.column) {
      const column = columnMenu.column;
      setColumnMenu({ anchor: null });
      setEditColumnDialogProps({
        open: true,
        column,
        orgId,
        onClose: async () => {
          setEditColumnDialogProps({ open: false });
          await initializeTable();
        },
        onError: (message: string) => {
          setAlertDialogProps({
            open: true,
            title: 'Edit Column',
            message: `Unable to edit column: ${message}`,
            onClose: () => { setAlertDialogProps({ open: false }); },
          });
        },
      });
    }
  };

  const deleteColumn = () => {
    if (columnMenu.column) {
      const column = columnMenu.column;
      setColumnMenu({ anchor: null });
      setColumnToDelete(column);
    }
  };

  const confirmDeleteColumn = async () => {
    if (!columnToDelete) {
      return;
    }
    try {
      await axios.delete(`api/roster/${orgId}/column/${columnToDelete.name}`);
    } catch (error) {
      let message = 'Internal Server Error';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0].message;
      } else {
        console.log(error);
      }
      setAlertDialogProps({
        open: true,
        title: 'Delete Column',
        message: `Unable to delete column: ${message}`,
        onClose: () => { setAlertDialogProps({ open: false }); },
      });
    }
    setColumnToDelete(null);
    await initializeTable();
  };

  const cancelDeleteColumnDialog = () => {
    setColumnToDelete(null);
  };

  const handleColumnMenuClick = (column: ApiRosterColumnInfo) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnMenu({ anchor: event.currentTarget, column });
  };

  const handleColumnMenuClose = () => {
    setColumnMenu({ anchor: null });
  };

  useEffect(() => { initializeTable().then(); }, [initializeTable]);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <Grid container>
          <Grid item xs={6}>
            <h1>Custom Roster Columns</h1>
          </Grid>
          <Grid className={classes.newColumn} item xs={6}>
            <Button
              color="primary"
              onClick={newColumn}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Column
            </Button>
          </Grid>
        </Grid>
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="column table">
            <TableHead>
              <TableRow>
                <TableCell>Field Name</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell className={classes.iconCell}>PII</TableCell>
                <TableCell className={classes.iconCell}>PHI</TableCell>
                <TableCell className={classes.iconCell}>Required</TableCell>
                <TableCell className={classes.iconCell} />
              </TableRow>
            </TableHead>
            <TableBody>
              {columns.map(column => (
                <TableRow key={column.name}>
                  <TableCell component="th" scope="row">{column.name}</TableCell>
                  <TableCell>{column.displayName}</TableCell>
                  <TableCell className={classes.typeColumn}>{column.type}</TableCell>
                  <TableCell className={classes.iconCell}>
                    {column.pii ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    {column.phi ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    {column.required ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={classes.iconCell}>
                    <IconButton
                      aria-label="workspace actions"
                      aria-controls={`workspace-${column.name}-menu`}
                      aria-haspopup="true"
                      onClick={handleColumnMenuClick(column)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <Menu
                id="column-menu"
                anchorEl={columnMenu.anchor}
                keepMounted
                open={Boolean(columnMenu.column)}
                onClose={handleColumnMenuClose}
              >
                <MenuItem onClick={editColumn}>Edit Column</MenuItem>
                <MenuItem onClick={deleteColumn}>Delete Column</MenuItem>
              </Menu>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {Boolean(columnToDelete) && (
        <Dialog
          open={Boolean(columnToDelete)}
          onClose={cancelDeleteColumnDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Roster Column</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete the '${columnToDelete?.displayName}' roster column?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteColumn}>
              Yes
            </Button>
            <Button onClick={cancelDeleteColumnDialog}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {editColumnDialogProps.open && (
        <EditColumnDialog
          open={editColumnDialogProps.open}
          orgId={editColumnDialogProps.orgId}
          column={editColumnDialogProps.column}
          onClose={editColumnDialogProps.onClose}
          onError={editColumnDialogProps.onError}
        />
      )}
      {alertDialogProps.open && (
        <AlertDialog open={alertDialogProps.open} title={alertDialogProps.title} message={alertDialogProps.message} onClose={alertDialogProps.onClose} />
      )}
    </main>
  );
};

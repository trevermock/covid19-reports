import {
  Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow,
  IconButton, TableFooter, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Roster } from '../../../actions/rosterActions';
import useStyles from './RosterPage.styles';
import { UserState } from '../../../reducers/userReducer';
import { AppState } from '../../../store';

interface RosterEntry {
  edipi: string,
  rate_rank: string,
  first_name: string,
  last_name: string,
  unit: string,
  billet_workcenter: string,
  contract_number: string,
  pilot: boolean,
  aircrew: boolean,
  cdi: boolean,
  cdqar: boolean,
  dscacrew: boolean,
  advanced_party: boolean,
  pui: boolean,
  covid19_test_return_date: Date,
  rom: string,
  rom_release: string
}

interface CountResponse {
  count: number
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles();
  const {
    count, page, rowsPerPage, onChangePage,
  } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.tableFooter}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

export const RosterPage = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const fileInputRef = React.createRef<HTMLInputElement>();

  const [rows, setRows] = useState<RosterEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rosterSize, setRosterSize] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState({ open: false, message: '', title: '' });

  const orgId = useSelector<AppState, UserState>(state => state.user).activeRole?.org.id;

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    const response = await fetch(`api/roster/${orgId}?limit=${rowsPerPage}&page=${newPage}`);
    const rosterResponse = (await response.json()) as RosterEntry[];
    setPage(newPage);
    setRows(rosterResponse);
  };

  function initializeTable() {
    fetch(`api/roster/${orgId}/count`).then(async response => {
      const countResponse = (await response.json()) as CountResponse;
      setRosterSize(countResponse.count);
      await handleChangePage(null, 0);
    });
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    dispatch(Roster.upload(e.target.files[0], async count => {
      if (count < 0) {
        setAlert({
          open: true,
          message: 'An error occurred while uploading roster. Please verify the roster data.',
          title: 'Upload Error',
        });
      } else {
        setAlert({ open: true, message: `Successfully uploaded ${count} roster entries.`, title: 'Upload Successful' });
        initializeTable();
      }
    }));
  }

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const response = await fetch(`api/roster/${orgId}?limit=${newRowsPerPage}&page=0`);
    const rosterResponse = (await response.json()) as RosterEntry[];
    setPage(0);
    setRows(rosterResponse);
    setRowsPerPage(newRowsPerPage);
  };

  const handleAlertClose = () => {
    setAlert({ open: false, message: '', title: '' });
  };

  useEffect(initializeTable, []);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.buttons}>
          <input
            accept="text/csv"
            id="raised-button-file"
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              // type="button"
              variant="contained"
              color="primary"
              size="large"
              component="span"
            >
              Upload CSV
            </Button>
          </label>

          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            href={`api/roster/${orgId}/template`}
          >
            Download CSV Template
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>EDIPI</TableCell>
                <TableCell>Rate/Rank</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.edipi}>
                  <TableCell component="th" scope="row">
                    {row.edipi}
                  </TableCell>
                  <TableCell>{row.rate_rank}</TableCell>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  count={rosterSize}
                  colSpan={5}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
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
          <Button onClick={handleAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

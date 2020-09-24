import {
  Card,
  CardContent,
  Button,
  ButtonGroup,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  IconButton,
  TableFooter,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
//import { CSVLink } from "react-csv";
import { Chart } from "react-charts";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Roster } from "../../../actions/rosterActions";
import { chartsDataMock } from "../../../mocks/chartsDataMock";
import { musterDataMock } from "../../../mocks/musterDataMock";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";

import useStyles from "./MusterPage.styles";
import { UserState } from "../../../reducers/userReducer";
import { AppState } from "../../../store";

interface MusterEntry {
  last_observation: string;
  unit: string;
  phone: string;
  rate_rank: string;
  name: string;
  edipi: string;
  non_muster_rate: string;
}

interface CountResponse {
  count: number;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles();
  const { count, page, rowsPerPage, onChangePage } = props;

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
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
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

export const MusterPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const fileInputRef = React.createRef<HTMLInputElement>();

  const [unit, setUnit] = useState("All Units");
  const [rows, setRows] = useState<MusterEntry[]>([]);
  const [page, setPage] = useState(0);
  const [musterSize, setMusterSize] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState({ open: false, message: "", title: "" });

  const orgId = useSelector<AppState, UserState>((state) => state.user).roles[0].org.id;

  function createUnitMenuItems() {
    const unitNames = rows ? Array.from(new Set(rows.map((r) => r.unit))) : [];

    return unitNames.map((name, index) => {
      return <MenuItem value={name}>{name}</MenuItem>;
    });
  }

  function initializeTable() {
    setPage(0);
    setRows(musterDataMock.data as MusterEntry[]);
    setMusterSize(musterDataMock.data.length);
    setUnit("All Units");
  }

  function handleUnitChange(event: React.ChangeEvent<{ value: unknown }>) {
    console.dir(event.target.value);
    setUnit(event.target.value as string);
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    dispatch(
      Roster.upload(e.target.files[0], async (count) => {
        if (count < 0) {
          setAlert({
            open: true,
            message: `An error occurred while uploading roster. Please verify the roster data.`,
            title: `Upload Error`,
          });
        } else {
          setAlert({
            open: true,
            message: `Successfully uploaded ${count} roster entries.`,
            title: "Upload Successful",
          });
          initializeTable();
        }
      })
    );
  }

  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    const response = await fetch(`api/roster/${orgId}?limit=${rowsPerPage}&page=${newPage}`);
    const rosterResponse = (await response.json()) as MusterEntry[];
    setPage(newPage);
    setRows(rosterResponse);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const response = await fetch(`api/roster/${orgId}?limit=${newRowsPerPage}&page=0`);
    const rosterResponse = (await response.json()) as MusterEntry[];
    setPage(0);
    setRows(rosterResponse);
    setRowsPerPage(newRowsPerPage);
  };

  const handleAlertClose = () => {
    setAlert({ open: false, message: "", title: "" });
  };

  const filterByUnit = () => {
    const filteredRows =
      rows && unit != "All Units"
        ? rows.filter((r) => {
            return r.unit === unit;
          })
        : rows;

    return filteredRows;
  };

  useEffect(initializeTable, []);

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: "bold",
              display: "flex",
              alignContent: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            Muster Non-compliance
          </div>
          <div className={classes.buttons} style={{ flex: "auto", justifyContent: "flex-end" }}>
            <input
              accept="text/csv"
              id="raised-button-file"
              type="file"
              style={{ display: "none" }}
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
                startIcon={<SystemUpdateAltIcon />}
              >
                Export Data
              </Button>
            </label>
          </div>
        </div>

        <Container style={{ flexDirection: "row", display: "flex", justifyContent: "flex-start", background: "white" }}>
          <ButtonGroup style={{ marginBottom: 16, marginTop: 16 }} aria-label="outlined primary button group">
            <Button>12 HR</Button>
            <Button>1 Day</Button>
            <Button>2 Days</Button>
            <Button>3 Days</Button>
            <Button>5 Days</Button>
          </ButtonGroup>

          <FormControl style={{ marginLeft: 30, width: 143, height: 15 }} variant="outlined">
            <Select
              style={{ height: 37, marginTop: 16 }}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={unit}
              onChange={handleUnitChange}
            >
              <MenuItem value={"All Units"}>All Units</MenuItem>
              {createUnitMenuItems()}
            </Select>
          </FormControl>
        </Container>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>LAST OBSERVATION</TableCell>
                <TableCell>UNIT</TableCell>
                <TableCell>PHONE</TableCell>
                <TableCell>RATE/RANK</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>EDIPI</TableCell>
                <TableCell>NON-MUSTER RATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterByUnit().map((row) => (
                <TableRow key={row.edipi}>
                  <TableCell component="th" scope="row">
                    {row.last_observation}
                  </TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.rate_rank}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.edipi}</TableCell>
                  <TableCell>{row.non_muster_rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  count={musterSize}
                  colSpan={5}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
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

        <div style={{ display: "flex", marginTop: 32 }}>
          <Card className={classes.card} style={{ marginRight: 15 }}>
            <CardContent className={classes.cardContent}>
              <div style={{ flex: "1" }}>
                <Chart data={chartsDataMock.lineChart.data} axes={chartsDataMock.lineChart.axes} />
              </div>
            </CardContent>
          </Card>

          <Card className={classes.card} style={{ marginLeft: 15 }}>
            <CardContent className={classes.cardContent}>
              <div style={{ flex: "1" }}>
                <Chart
                  data={chartsDataMock.areaChart.data}
                  axes={chartsDataMock.areaChart.axes}
                  series={chartsDataMock.areaChart.series}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      <Dialog
        open={alert.open}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{alert.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{alert.message}</DialogContentText>
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

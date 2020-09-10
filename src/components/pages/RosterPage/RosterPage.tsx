import {
  Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Roster } from '../../../actions/rosterActions';

import useStyles from './RosterPage.styles';

export const RosterPage = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const fileInputRef = React.createRef<HTMLInputElement>();

  function createData(name: number, calories: string, fat: string, carbs: string, protein: string) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData(1, '1', 'First1', 'Last1', 'HSC-22'),
    createData(2, '2', 'First2', 'Last2', 'HSC-22'),
    createData(3, '3', 'First3', 'Last3', 'HSC-22'),
    createData(4, '4', 'First4', 'Last4', 'HSC-22'),
    createData(5, '5', 'First5', 'Last5', 'HSC-22'),
  ];


  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files[0] == null) {
      return;
    }

    dispatch(Roster.upload(e.target.files[0]));
  }

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.buttons}>
          <input
            accept="text/csv"
            id="raised-button-file"
            type="file"
            style={{display: 'none'}}
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

          {/*<Button*/}
          {/*  type="button"*/}
          {/*  variant="contained"*/}
          {/*  color="primary"*/}
          {/*  size="large"*/}
          {/*  // onClick={handleUploadClick}*/}
          {/*>*/}
          {/*  Upload*/}
          {/*  <input*/}
          {/*    type="file"*/}
          {/*    style={{ display: "none" }}*/}
          {/*  />*/}
          {/*</Button>*/}

          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
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
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.calories}</TableCell>
                  <TableCell>{row.fat}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </main>
  )
}

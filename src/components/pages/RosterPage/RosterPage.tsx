import {
  Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import React from 'react';

import useStyles from './RosterPage.styles';

export const RosterPage = () => {
  const classes = useStyles();

  // TODO: This is just placeholder... use real data here
  function createData(edipi: number, rateRank: string, firstName: string, lastName: string, unit: string) {
    return { edipi, rateRank, firstName, lastName, unit };
  }

  const rows = [
    createData(1, '1', 'First1', 'Last1', 'HSC-22'),
    createData(2, '2', 'First2', 'Last2', 'HSC-22'),
    createData(3, '3', 'First3', 'Last3', 'HSC-22'),
    createData(4, '4', 'First4', 'Last4', 'HSC-22'),
    createData(5, '5', 'First5', 'Last5', 'HSC-22'),
  ];

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.buttons}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
          >
            Upload
          </Button>

          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
          >
            Download
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
                <TableRow key={row.edipi}>
                  <TableCell component="th" scope="row">
                    {row.edipi}
                  </TableCell>
                  <TableCell>{row.rateRank}</TableCell>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </main>
  )
}

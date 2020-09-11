import { Container } from '@material-ui/core';
import React from 'react';

import useStyles from './UsersPage.styles';


export const UsersPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <h1>User management coming soon.</h1>
      </Container>
    </main>
  )
}

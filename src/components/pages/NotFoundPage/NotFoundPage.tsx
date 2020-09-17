import { Container } from '@material-ui/core';
import React from 'react';
import useStyles from './NotFoundPage.styles';

export const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <h1>Page not found.</h1>
      </Container>
    </main>
  );
};

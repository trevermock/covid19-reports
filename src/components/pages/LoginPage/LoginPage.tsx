import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, TextField, FormControl } from '@material-ui/core';

import useStyles from './LoginPage.styles';
import logo from '../../../media/dod-logo.png';

export const LoginPage = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <header className={classes.header}>
        <img className={classes.headerImage} src={logo} alt="Department of Defense" />
        <div className={classes.headerText}>
          <span className={classes.dodTitle}>Department of Defense</span><br/>
          <span className={classes.appTitle}>
            Coronavirus (COVID-19)<br/>
            Reports
          </span>
        </div>
      </header>

      <Container maxWidth="sm">
        <h1 style={{marginTop: '40px'}}>Login</h1>

        <form>
          <FormControl>
            <TextField className={classes.textField} name="username" placeholder="Username..." />
          </FormControl>
          <br/>
          <FormControl>
            <TextField className={classes.textField} name="password" type="password" placeholder="Password..." />
          </FormControl>
          <br/>
          <FormControl>
            <Link to="/home">
              <Button type="submit" variant="contained" color="primary" style={{marginTop: '40px'}}>
                Login
              </Button>
            </Link>
          </FormControl>
        </form>
      </Container>
    </main>
  )
};

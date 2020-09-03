import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, FormControl } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { User } from '../../../actions/userActions';
import { UserState } from '../../../reducers/userReducer';
import { AppState } from '../../../store';
import useStyles from './LoginPage.styles';
import logo from '../../../media/dod-logo.png';

export const LoginPage = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  function handleLoginClick() {
    dispatch(User.login());
  }

  useEffect(() => {
    if (user.isLoggedIn) {
      history.push('/home');
    }
  });

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
            <Button
              type="button"
              variant="contained"
              color="primary"
              style={{marginTop: '40px'}}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </FormControl>
        </form>
      </Container>
    </main>
  )
};

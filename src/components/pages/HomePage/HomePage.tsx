import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core';

import { UserState, HomeView } from '../../../reducers/userReducer';
import { AppState } from '../../../store';
import useStyles from './HomePage.styles';
import { HomePageBasic } from './HomePageBasic';
import { HomePageLeadership } from './HomePageLeadership';
import { HomePageMedical } from './HomePageMedical';

export const HomePage = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const classes = useStyles();

  function getContentComponent() {
    switch (user.homeView) {
      case HomeView.Basic:
        return <HomePageBasic/>;
      case HomeView.Leadership:
        return <HomePageLeadership/>;
      case HomeView.Medical:
        return <HomePageMedical/>;
      default:
        return <div/>;
    }
  }

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        {getContentComponent()}
      </Container>
    </main>
  )
};

import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { User } from '../actions/user.actions';
import { AppFrameState } from '../reducers/app-frame.reducer';
import { UserState } from '../reducers/user.reducer';
import { AppState } from '../store';
import { AppSidenav } from './app-sidenav/app-sidenav';
import { AppToolbar } from './app-toolbar/app-toolbar';
import { HomePage } from './pages/home-page/home-page';
import useStyles from './app.styles';
import { GroupsPage } from './pages/groups-page/groups-page';
import { RosterPage } from './pages/roster-page/roster-page';
import { UserRegistrationPage } from './pages/user-registration-page/user-registration-page';
import { UsersPage } from './pages/users-page/users-page';

export const App = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const appFrame = useSelector<AppState, AppFrameState>(state => state.appFrame);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(User.login());
  }, [dispatch]);

  function routes() {
    if (!user.isLoggedIn) {
      // TODO: Show spinner here.
      return <></>;
    }

    if (!user.isRegistered) {
      return (
        <Switch>
          <Route path="/register">
            <UserRegistrationPage />
          </Route>
          <Redirect to="/register" />
        </Switch>
      );
    }

    if (!user.activeRole) {
      return (
        <>
          <AppToolbar />

          <Switch>
            <Route path="/groups">
              <GroupsPage />
            </Route>
            <Redirect to="/groups" />
          </Switch>
        </>
      );
    }

    return (
      <>
        <AppToolbar />
        <AppSidenav />

        <div
          className={clsx(classes.content, {
            [classes.contentSidenavCollapsed]: !appFrame.sidenavExpanded,
            [classes.contentSidenavExpanded]: appFrame.sidenavExpanded,
          })}
        >
          <div
            className={clsx({
              [classes.contentFaded]: appFrame.isPageLoading,
            })}
          >
            <Switch>
              <Route path="/home">
                <HomePage />
              </Route>
              <Route path="/roster">
                <RosterPage />
              </Route>
              <Route path="/users">
                <UsersPage />
              </Route>
              <Route path="/groups">
                <GroupsPage />
              </Route>
              <Route path="/*">
                <Redirect to="/home" />
              </Route>
            </Switch>
          </div>

          <div
            className={clsx(classes.content, {
              [classes.fixedContentCenteredSidenavCollapsed]: !appFrame.sidenavExpanded,
              [classes.fixedContentCenteredSidenavExpanded]: appFrame.sidenavExpanded,
            })}
          >
            { appFrame.isPageLoading ? <CircularProgress /> : '' }
          </div>

        </div>

      </>
    );
  }

  return (
    <>
      {routes()}
    </>
  );
};

import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, useHistory, useLocation, Link } from 'react-router-dom';
import {
  AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';

import { User } from '../actions/userActions';
import { UserState } from '../reducers/userReducer';
import { AppState } from '../store';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import useStyles from './App.styles';
import { RosterPage } from './pages/RosterPage/RosterPage';

export const App = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const prevUser = usePrevious<UserState>(user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  function toggleDrawerOpen() {
    setDrawerOpen(!drawerOpen);
  }

  function handleLogoutClick() {
    dispatch(User.logout());
  }

  function isAppBarVisible() {
    return (user.isLoggedIn && location.pathname !== '/login');
  }

  function usePrevious<T>(value: T) {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (user.isLoggedIn !== prevUser?.isLoggedIn) {
      history.push('/login');
    }
  });

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
          [classes.hide]: !isAppBarVisible(),
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawerOpen}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            DDS Covid Reporting
          </Typography>
          <Button
            type="button"
            style={{ color: 'white' }}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
          [classes.hide]: !isAppBarVisible(),
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
        </div>
        <Divider/>
        <List>
          <Link to="/home">
            <ListItem button key="Home">
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItem>
          </Link>
          <a href="/dashboard">
            <ListItem button key="Dashboard">
              <ListItemIcon><BarChartIcon/></ListItemIcon>
              <ListItemText primary="Dashboard"/>
            </ListItem>
          </a>

        </List>
        <Divider/>
        <List>
          <ListItem button key="Users">
            <ListItemIcon><PeopleIcon/></ListItemIcon>
            <ListItemText primary="Users"/>
          </ListItem>

          <Link to="/roster">
            <ListItem button key="Roster">
              <ListItemIcon><ListAltIcon/></ListItemIcon>
              <ListItemText primary="Roster"/>
            </ListItem>
          </Link>
        </List>
      </Drawer>

      <div
        className={clsx(classes.toolbar, {
          [classes.hide]: !isAppBarVisible(),
        })}
      />

      <Switch>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/home">
          <HomePage/>
        </Route>
        <Route path="/roster">
          <RosterPage/>
        </Route>

        <Redirect from="/" exact to="/login"/>
      </Switch>
    </>
  )
};

export default App;

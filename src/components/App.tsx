import clsx from 'clsx';
import React from 'react';
import { Switch, Route, Redirect, Link, useLocation } from 'react-router-dom';
import {
  AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';

import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import useStyles from './App.styles';

export const App = () => {
  const classes = useStyles();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const loggedIn = () => {
    // HACK: Just pretend we're not logged in if we're on the login page for now.
    return location.pathname !== '/login';
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
          [classes.hide]: !loggedIn(),
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
          <Link to="/login">
            <Button style={{ color: 'white' }}>Logout</Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
          [classes.hide]: !loggedIn(),
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
          <ListItem button key="Home">
            <ListItemIcon><HomeIcon/></ListItemIcon>
            <ListItemText primary="Home"/>
          </ListItem>
          <ListItem button key="Kibana">
            <ListItemIcon><BarChartIcon/></ListItemIcon>
            <ListItemText primary="Kibana"/>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button key="Users">
            <ListItemIcon><PeopleIcon/></ListItemIcon>
            <ListItemText primary="Users"/>
          </ListItem>
          <ListItem button key="Rosters">
            <ListItemIcon><ListAltIcon/></ListItemIcon>
            <ListItemText primary="Rosters"/>
          </ListItem>
        </List>
      </Drawer>

      <div
        className={clsx(classes.toolbar, {
          [classes.hide]: !loggedIn(),
        })}
      />

      <Switch>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/home">
          <HomePage/>
        </Route>
        <Redirect from="/" exact to="/login"/>
      </Switch>
    </>
  )
};

export default App;

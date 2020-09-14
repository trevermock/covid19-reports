import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import {
  AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography
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
import useStyles from './App.styles';
import { RosterPage } from './pages/RosterPage/RosterPage';
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { UsersPage } from "./pages/UsersPage/UsersPage";
import logoIcon from '../media/images/logo-icon.png';
import logoText from '../media/images/logo-text.png';

export const App = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  function toggleDrawerOpen() {
    setDrawerOpen(!drawerOpen);
  }

  useEffect(() => {
    dispatch(User.login());
  }, [dispatch]);

  if (!user.isLoggedIn) {
    return (<></>);
  }

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen
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
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <img src={logoIcon} height="34" alt="Status Engine Logo Icon" />
          <img src={logoText} height="20" style={{marginLeft: '10px'}} alt="Status Engine Logo Text" />
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
            <ListItem button key="Analytics">
              <ListItemIcon><BarChartIcon/></ListItemIcon>
              <ListItemText primary="Analytics"/>
            </ListItem>
          </a>
        </List>
        <Divider/>
        <List>
          {user.roles[0].canManageUsers &&
            <Link to="/users">
              <ListItem button key="Users">
                <ListItemIcon><PeopleIcon/></ListItemIcon>
                <ListItemText primary="Users"/>
              </ListItem>
            </Link>
          }

          {user.roles[0].canManageRoster &&
            <Link to="/roster">
              <ListItem button key="Roster">
                <ListItemIcon><ListAltIcon/></ListItemIcon>
                <ListItemText primary="Roster"/>
              </ListItem>
            </Link>
          }
        </List>
      </Drawer>

      <div className={classes.toolbar}/>

      <div
        className={clsx(classes.content, {
          [classes.contentDrawerClosed]: (user.isLoggedIn && !drawerOpen),
          [classes.contentDrawerOpened]: (user.isLoggedIn && drawerOpen),
        })}
      >
        <Switch>
          <Route path="/home">
            <HomePage/>
          </Route>
          <Route path="/roster">
            <RosterPage/>
          </Route>
          <Route path="/users">
            <UsersPage/>
          </Route>
          <Redirect from="/" exact to="/home"/>
          <Route path="/*">
            <NotFoundPage/>
          </Route>
        </Switch>
      </div>
    </>
  )
};

export default App;

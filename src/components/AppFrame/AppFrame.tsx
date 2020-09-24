import {
  AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Toolbar,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User } from '../../actions/userActions';
import logoIcon from '../../media/images/logo-icon.png';
import logoText from '../../media/images/logo-text.png';
import { AppFrameState } from '../../reducers/appFrameReducer';
import { UserState } from '../../reducers/userReducer';
import { AppState } from '../../store';
import { AppFrame as AppFrameActions } from '../../actions/appFrameActions';
import useStyles from './AppFrame.styles';

export const AppFrame = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const appFrame = useSelector<AppState, AppFrameState>(state => state.appFrame);

  function toggleSidenavOpen() {
    dispatch(AppFrameActions.toggleSidenavExpanded());
  }

  function handleOrgChanged(event: React.ChangeEvent<{ value: unknown }>) {
    dispatch(User.changeOrg(event.target.value as number));
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: appFrame.sidenavExpanded,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidenavOpen}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          {user.activeRole && user.roles.length > 1
            && (
              <Select
                className={classes.orgSelect}
                labelId="org-select-label"
                id="org-select"
                value={user.activeRole.org.id}
                onChange={handleOrgChanged}
                inputProps={{
                  classes: {
                    icon: classes.orgSelectIcon,
                  },
                }}
              >
                {user.roles.map(role => (
                  <MenuItem value={role.org.id} key={role.org.id}>{role.org.name}</MenuItem>
                ))}
              </Select>
            )}

        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.sidenav, {
          [classes.sidenavExpanded]: appFrame.sidenavExpanded,
          [classes.sidenavCollapsed]: !appFrame.sidenavExpanded,
        })}
        classes={{
          paper: clsx({
            [classes.sidenavExpanded]: appFrame.sidenavExpanded,
            [classes.sidenavCollapsed]: !appFrame.sidenavExpanded,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <img src={logoIcon} height="34" alt="Status Engine Logo Icon" />
          <img src={logoText} height="20" style={{ marginLeft: '10px' }} alt="Status Engine Logo Text" />
        </div>
        <Divider />
        <List>
          <Link to="/home">
            <ListItem button key="Home">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          <Link to="/muster">
            <ListItem button key="Muster">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Muster" />
            </ListItem>
          </Link>
          <a href={`/dashboard?orgId=${user.activeRole?.org.id}`}>
            <ListItem button key="Analytics">
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItem>
          </a>
        </List>
        <Divider />
        <List>
          {user.activeRole?.canManageUsers && (
            <Link to="/users">
              <ListItem button key="Users">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
            </Link>
          )}

          {user.activeRole?.canManageRoster && (
            <Link to="/roster">
              <ListItem button key="Roster">
                <ListItemIcon><ListAltIcon /></ListItemIcon>
                <ListItemText primary="Roster" />
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>

      <div className={classes.toolbar} />
    </div>
  );
};

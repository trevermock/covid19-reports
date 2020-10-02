import React from 'react';
import {
  Divider, Drawer, List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppFrameState } from '../../reducers/app-frame.reducer';
import { UserState } from '../../reducers/user.reducer';
import { AppState } from '../../store';
import useStyles from './app-sidenav.styles';

export const AppSidenav = () => {
  const classes = useStyles();
  const user = useSelector<AppState, UserState>(state => state.user);
  const appFrame = useSelector<AppState, AppFrameState>(state => state.appFrame);

  return (
    <div className={classes.root}>
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
        <Divider />
        <List>
          <Link to="/home">
            <ListItem button key="Home">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          <a href={`/dashboard?orgId=${user.activeRole?.org?.id}`}>
            <ListItem button key="Analytics">
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItem>
          </a>
        </List>
        <Divider />
        <List>
          {user.activeRole?.canManageGroup && (
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
    </div>
  );
};

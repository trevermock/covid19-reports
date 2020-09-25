import {
  AppBar, IconButton, MenuItem, Select, Toolbar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppFrame as AppFrameActions } from '../../actions/appFrameActions';
import { User } from '../../actions/userActions';
import { AppFrameState } from '../../reducers/appFrameReducer';
import { UserState } from '../../reducers/userReducer';
import { AppState } from '../../store';
import useStyles from './AppToolbar.styles';
import logoImage from '../../media/images/logo.png';

export const AppToolbar = () => {
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
    <>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <img className={classes.logo} src={logoImage} alt="StatusEngine Logo" height="35" />

          {user.activeRole && user.roles.length > 1 && (
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

      {/*<div className={classes.toolbar} />*/}
      <Toolbar />
    </>
  );
};

import {
  AppBar, Button, Menu, MenuItem, Select, Toolbar,
} from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User } from '../../actions/user.actions';
import { UserState } from '../../reducers/user.reducer';
import { AppState } from '../../store';
import useStyles from './app-toolbar.styles';
import logoImage from '../../media/images/logo.png';

export const AppToolbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<HTMLElement | null>(null);

  function handleOrgChanged(event: React.ChangeEvent<{ value: unknown }>) {
    dispatch(User.changeOrg(event.target.value as number));
  }

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <img className={classes.logo} src={logoImage} alt="StatusEngine Logo" height="35" />
          <div className={classes.spacer} />
          {user.activeRole && user.roles && user.roles.length > 1 && (
            <Select
              className={classes.orgSelect}
              labelId="org-select-label"
              id="org-select"
              value={user.activeRole.org?.id}
              onChange={handleOrgChanged}
              inputProps={{
                classes: {
                  icon: classes.orgSelectIcon,
                },
              }}
            >
              {user.roles.map(role => (
                <MenuItem value={role.org?.id} key={role.org?.id}>{role.org?.name}</MenuItem>
              ))}
            </Select>
          )}

          <Button
            className={classes.userButton}
            variant="text"
            onClick={e => setUserMenuAnchor(e.currentTarget)}
          >
            {`${user.firstName} ${user.lastName}`}
          </Button>
          <Menu
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorEl={userMenuAnchor}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem>
              <Link to="/groups" onClick={() => setUserMenuAnchor(null)}>
                My Groups
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Empty toolbar used for spacing purposes */}
      <Toolbar />
    </>
  );
};

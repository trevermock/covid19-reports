import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const sidenavWidthExpanded = 240;
export const sidenavWidthCollapsed = 58;

export default makeStyles((theme: Theme) => createStyles({
  root: {
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  sidenav: {
    width: sidenavWidthExpanded,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  sidenavExpanded: {
    width: sidenavWidthExpanded,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  sidenavCollapsed: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: sidenavWidthCollapsed,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

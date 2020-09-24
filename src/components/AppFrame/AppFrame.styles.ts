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
  appBar: {
    backgroundColor: '#162e51',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: sidenavWidthExpanded,
    width: `calc(100% - ${sidenavWidthExpanded}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  orgSelect: {
    color: 'white',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
  },
  orgSelectIcon: {
    fill: 'white',
  },
  menuButton: {
    marginRight: 36,
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

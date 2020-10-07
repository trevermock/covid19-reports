import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { sidenavWidthExpanded } from '../app-sidenav/app-sidenav.styles';

export default makeStyles((theme: Theme) => createStyles({
  appBar: {
    backgroundColor: '#3A4759',
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
  logo: {
    transform: 'translateY(-2px)',
  },
  spacer: {
    flex: 1,
  },
  orgSelect: {
    color: 'white',
    border: 'none',
    marginRight: '20px',
    '&:before': {
      borderColor: 'transparent',
    },
    '&:after': {
      borderColor: 'transparent',
    },
  },
  orgSelectIcon: {
    fill: 'white',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  userButton: {
    color: 'white',
  },
}));

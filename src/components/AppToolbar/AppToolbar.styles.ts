import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { sidenavWidthExpanded } from '../AppSidenav/AppSidenav.styles';

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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

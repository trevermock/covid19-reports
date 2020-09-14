import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const drawerWidthOpened = 240;
const drawerWidthClosed = 58;

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: '#162e51',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidthOpened,
      width: `calc(100% - ${drawerWidthOpened}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none !important',
    },
    drawer: {
      width: drawerWidthOpened,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidthOpened,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: drawerWidthClosed,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      transition: theme.transitions.create('margin-left', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    contentDrawerOpened: {
      marginLeft: drawerWidthOpened,
    },
    contentDrawerClosed: {
      marginLeft: drawerWidthClosed,
    },
    title: {
      flexGrow: 1,
      textAlign: 'left',
    },
  }),
);

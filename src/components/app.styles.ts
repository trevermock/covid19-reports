import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { sidenavWidthCollapsed, sidenavWidthExpanded } from './app-sidenav/app-sidenav.styles';

export default makeStyles((theme: Theme) => createStyles({
  content: {
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentSidenavExpanded: {
    marginLeft: sidenavWidthExpanded,
  },
  contentSidenavCollapsed: {
    marginLeft: sidenavWidthCollapsed,
  },
  contentFaded: {
    opacity: 0.15,
  },
  fixedContentCenteredSidenavExpanded: {
    paddingLeft: sidenavWidthExpanded / 2,
    paddingRight: sidenavWidthExpanded / 2,
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
  fixedContentCenteredSidenavCollapsed: {
    paddingLeft: sidenavWidthCollapsed / 2,
    paddingRight: sidenavWidthCollapsed / 2,
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
}));

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100vw',
    height: '100vh',
    padding: '5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    width: '1075px',
    height: '740px',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    boxShadow: '0px 4px 25px 5px rgba(0, 0, 0, 0.06);',
  },
  paper: {
    width: '100%',
    height: '100%',
  },
  contentLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: '#3A4758',
    color: 'white',
    lineHeight: '63px',
    fontSize: '17px',
    fontWeight: 500,

    '& ul': {
      listStyleType: 'none',
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),

      '& li': {
        display: 'flex',
        alignItems: 'center',
      },
    },

    '& svg': {
      color: theme.palette.primary.light,
      marginRight: '25px',
      fontSize: '32px',
    },
  },
  contentRight: {
    flex: 1,
    padding: theme.spacing(3),
  },
  welcomeHeader: {
    padding: theme.spacing(3),

    '& *:nth-child(1)': theme.typography.h1,
    '& *:nth-child(2)': theme.typography.subtitle1,
  },
  form: {
    '& > div': {
      display: 'flex',
      alignItems: 'center',

      '& > *': {
        flex: 1,
      },
    },
  },
  createAccountButton: {
    margin: theme.spacing(3),
  },
}));

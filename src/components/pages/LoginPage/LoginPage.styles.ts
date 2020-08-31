import { createStyles } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },
    header: {
      padding: '15px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#162e51',
      fontFamily: '"Merriweather", serif',
      textAlign: 'left',
    },
    headerImage: {
      width: '100px',
    },
    headerText: {
      margin: '10px 20px',
      color: 'white',
    },
    dodTitle: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '20.625px',
    },
    appTitle: {
      fontSize: '22px',
      fontWeight: 900,
      lineHeight: '27.5px',
    },
    textField: {
      margin: theme.spacing(1),
      width: 200,
    },
  }),
);

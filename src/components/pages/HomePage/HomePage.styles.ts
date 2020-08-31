import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    card: {
      flex: '1',
      height: '400px',
      margin: '20px',
    },
    cardContent: {
      width: '100%',
      height: '100%',
      display: 'flex',
    },
  }),
);

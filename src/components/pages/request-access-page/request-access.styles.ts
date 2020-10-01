import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  paper: {
    marginBottom: theme.spacing(3),
  },
  infoCard: {
    backgroundColor: '#ECF4FC',
    marginBottom: theme.spacing(3),

    '& .MuiCardContent-root': {
      paddingLeft: theme.spacing(12),
      paddingRight: theme.spacing(12),
    },

    '& header': {
      '& *:nth-child(1)': {
        fontSize: '33px',
        fontWeight: 700,
        color: '#3D4551',
      },
      '& *.nth-child(2)': theme.typography.subtitle1,
    },
  },
  infoCardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',

    '& ol': {
      textAlign: 'left',
      marginBottom: theme.spacing(5),
    },
  },
  infoCardActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  emailHeader: {
    paddingLeft: '28px',
  },
}));

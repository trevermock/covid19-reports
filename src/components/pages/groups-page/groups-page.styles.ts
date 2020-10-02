import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  paper: {
    marginBottom: theme.spacing(3),
  },
  infoCard: {
    backgroundColor: '#ECF4FC',
    marginBottom: theme.spacing(3),

    '& p': {
      lineHeight: '28px',
    },

    '& .MuiCardContent-root': {
      paddingLeft: theme.spacing(12),
      paddingRight: theme.spacing(12),
    },

    '& .MuiCardActions-root': {
      padding: theme.spacing(1),
    },
  },
  infoCardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '18px',
  },
  infoCardStepList: {
    margin: '20px 0',
  },
  infoCardStep: {
    display: 'flex',
    marginBottom: '20px',
    textAlign: 'left',
    width: '550px',

    '& > *:nth-child(1)': {
      marginRight: '14px',
    },

    '& > *:nth-child(2)': {
      flex: 1,
    },
  },
  infoCardStepNumber: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '100px',
    width: '30px',
    height: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '19px',
    color: 'white',
  },
  infoCardActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  emailHeader: {
    paddingLeft: '28px',
  },
}));

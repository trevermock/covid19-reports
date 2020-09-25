import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    marginBottom: '39px',
  },
  tableHeader: {
    '& h2': {
      margin: 0,
      textTransform: 'none',
    },
  },
  accessRequestButtons: {
    display: 'flex',
    flexFlow: 'row',
    '& button': {
      flex: 1,
    },
  },
  accessRequestApproveButton: {
    backgroundColor: '#00A91C',
    '&:hover': {
      backgroundColor: '#008C17',
    },
  },
  accessRequestRejectButton: {
    backgroundColor: '#E41D3D',
    marginLeft: '5px',
    '&:hover': {
      backgroundColor: '#B6001D',
    },
  },
  roleDialog: {
  },
}));

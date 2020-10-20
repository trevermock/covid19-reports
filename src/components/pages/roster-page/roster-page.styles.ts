import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  buttons: {
    display: 'flex',
    marginBottom: theme.spacing(3),

    '& .MuiButtonBase-root': {
      marginRight: theme.spacing(3),
    },
  },
  fillWidth: {
    width: '100%',
  },
  tableButtons: {
    '& .MuiButtonBase-root': {
      padding: '6px 6px',
      minWidth: '0px',
    },
    '& MuiTableCell-root': {
      padding: '0px',
    },
  },
  editRosterEntryButton: {
    marginRight: '16px',
    border: '2px solid',
    '&:hover': {
      border: '2px solid',
    },
  },
  deleteRosterEntryButton: {
    color: '#E41D3D',
    border: '2px solid #E41D3D',
    '&:hover': {
      border: '2px solid #B6001D',
      color: '#B6001D',
      backgroundColor: 'white',
    },
  },
  tableFooter: {
    flexShrink: 0,
    padding: '10px 20px',
    marginLeft: theme.spacing(3),
  },
}));

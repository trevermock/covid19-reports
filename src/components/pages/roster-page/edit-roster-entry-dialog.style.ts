import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => createStyles({
  root: {
    '& .MuiGrid-spacing-xs-3': {
      margin: '0px -12px',
    },
  },
  textField: {
    width: '100%',
    margin: 0,
    '& .MuiInputBase-multiline': {
      padding: 0,
      '& textarea': {
        padding: '8px 12px',
      },
    },
  },
  booleanTable: {
    '&  .MuiTableCell-root': {
      border: '1px solid #E0E0E0',
      padding: '0px 16px',
      height: '32px',
      width: '100%',
    },
  },
  booleanTableLabel: {
    fontWeight: 'bold',
  },
  editRosterEntryDialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
}));

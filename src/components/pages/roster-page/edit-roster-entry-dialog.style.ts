import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default makeStyles((theme: Theme) => createStyles({
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
  textCell: {
    width: '70%',
    backgroundColor: '#F0F1F1',
  },
  iconCell: {
    textAlign: 'center',
    backgroundColor: '#EAEAEA',
    '& .MuiCheckbox-root': {
      position: 'relative',
      padding: '0px',
      '&:hover': {
        backgroundColor: 'rgb(115 179 231 / 27%)',
      },
      '& svg': {
        top: '0px',
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
  tableScroll: {
    maxHeight: '193px',
    overflowY: 'auto',
    borderStyle: 'solid',
    border: '1 px',
  },
  editRosterEntryDialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
}));

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
  roleHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#A9AEB1',
  },
  tableScroll: {
    maxHeight: '193px',
    overflowY: 'auto',
  },
  roleTable: {
    '&  .MuiTableCell-root': {
      border: '1px solid #E0E0E0',
      padding: '0px 16px',
      height: '32px',
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
  roleDialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
}));

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
  templateText: {
    width: '100%',
    margin: 0,
  },
  workspaceHeader: {
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
  templateDataTable: {
    '&  .MuiTableCell-root': {
      border: '1px solid #E0E0E0',
      padding: '0px 16px',
      height: '32px',
    },
  },
  templateSelect: {
    width: '100%',
    '&:before': {
      border: 'none',
    },
  },
  textCell: {
    width: '70%',
    backgroundColor: '#F0F1F1',
  },
  iconCell: {
    padding: '0px 16px',
    height: '32px',
    textAlign: 'center',
    backgroundColor: '#EAEAEA',
    '& svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
  dialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
}));

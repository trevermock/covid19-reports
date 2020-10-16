import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => createStyles({
  rootNoScroll: {
    border: '1px solid #71767a',
    borderRadius: '4px',
    maxHeight: '227px',
  },
  rootScroll: {
    border: '1px solid #71767a',
    borderRadius: '4px 0px 0px 4px',
    maxHeight: '227px',
    overflowY: 'auto',
  },
  booleanTable: {
    '& .MuiTableCell-root': {
      padding: '0px 16px',
      height: '32px',
    },
    '& td': {
      border: '1px solid #E0E0E0',
      borderTop: 0,
    },
    '& td:first-child': {
      borderLeft: 0,
      width: '70%',
    },
    '& td:last-child': {
      borderRight: 0,
      textAlign: 'center',
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
    '& tr:last-child td': {
      borderBottom: 0,
    },
  },
}));

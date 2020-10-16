import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  newColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  table: {
    marginBottom: '39px',
  },
  typeColumn: {
    textTransform: 'capitalize',
  },
  iconCell: {
    width: '81px',
    '& > svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
}));

import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  newWorkspace: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  table: {
    marginBottom: '39px',
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

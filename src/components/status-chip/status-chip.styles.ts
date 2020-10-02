import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  colorPrimary: {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  colorSecondary: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  colorSuccess: {
    borderColor: theme.palette.success.main,
    color: theme.palette.success.main,
  },
  colorWarning: {
    borderColor: theme.palette.warning.main,
    color: theme.palette.warning.main,
  },
  colorError: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
  },
}));

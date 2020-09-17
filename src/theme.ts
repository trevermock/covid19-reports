import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#005ea2',
    },
  },
});

theme.overrides = {
  MuiCardContent: {
    root: {
      padding: theme.spacing(3),
    },
  },
  MuiCardActions: {
    root: {
      padding: theme.spacing(3),
    },
  },
};

export default theme;

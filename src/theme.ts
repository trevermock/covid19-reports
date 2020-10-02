import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    text: {
      primary: '#3D4551',
    },
    primary: {
      main: '#005ea2',
      light: '#73B3E7',
    },
    warning: {
      main: '#C25D00',
    },
    error: {
      main: '#E41D3D',
    },
    success: {
      main: '#00A91C',
    },
  },
  typography: {
    h1: {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: '48px',
    },
    h2: {
      fontSize: '33px',
      fontWeight: 700,
      lineHeight: '48px',
    },
    subtitle1: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '29px',
    },
  },
});

theme.overrides = {
  MuiCssBaseline: {
    '@global': {
      body: {
        backgroundColor: 'rgb(240, 240, 240)',
      },
      a: {
        textDecoration: 'none',
      },
    },
  },
  MuiAppBar: {
    root: {
      boxShadow: 'none',
    },
  },
  MuiDrawer: {
    root: {
      '& .MuiDrawer-paper': {
        top: 'unset',
        bottom: 0,
        height: `calc(100% - ${64}px)`,
      },
    },
  },
  MuiTableCell: {
    head: {
      textTransform: 'uppercase',
    },
  },
  MuiCardContent: {
    root: {
      padding: theme.spacing(4),

      '& header > *:nth-child(1)': theme.typography.h2,
      '& header p': theme.typography.subtitle1,
    },
  },
  MuiCardActions: {
    root: {
      padding: theme.spacing(3),
    },
  },
  MuiInputBase: {
    root: {
      border: '1px solid #71767A',
      borderRadius: '4px',
    },
  },
  MuiTextField: {
    root: {
      margin: theme.spacing(3),

      '& input': {
        padding: '8px 12px',
      },

      '& label': {
        fontSize: '16px',
        fontWeight: 600,
        color: '#3D4551',
      },

      '& label + .MuiInput-formControl': {
        marginTop: '18px',
      },
    },
  },
  MuiSelect: {
    root: {
      padding: '8px 12px',
    },
  },
  MuiPaper: {
    root: {
      '& .MuiToolbar-root': {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
  },
  MuiMenuItem: {
    root: {
      '& a': {
        color: 'inherit',
      },
    },
  },
  MuiChip: {
    root: {
      borderRadius: '4px',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
};

theme.props = {
  MuiButton: {
    color: 'primary',
    variant: 'contained',
  },
  MuiIconButton: {
    color: 'primary',
  },
  MuiTextField: {
    InputLabelProps: {
      shrink: true,
    },
    InputProps: {
      disableUnderline: true,
    },
  },
};

export default theme;

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, ButtonProps } from '@material-ui/core';
import useStyles from './button-with-spinner.styles';

interface ButtonWithSpinnerProps extends ButtonProps {
  loading?: boolean
}

export const ButtonWithSpinner = (props: ButtonWithSpinnerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          disabled={props.loading}
        >
          { props.children }
        </Button>
        {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
};

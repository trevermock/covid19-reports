import React from 'react';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import useStyles from './alert-dialog.styles';

export interface AlertDialogProps {
  open: boolean,
  title?: string,
  message?: string,
  onClose?: () => void,
}

export const AlertDialog = (props: AlertDialogProps) => {
  const classes = useStyles();
  const {
    open, title, message, onClose,
  } = props;

  if (!open) {
    return <></>;
  }

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title || 'Alert'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField, Typography,
} from '@material-ui/core';
import axios from 'axios';
import useStyles from './edit-roster-entry-dialog.style';
import { ApiRosterEntry } from '../../../models/api-response';

export interface EditRosterEntryDialogProps {
  open: boolean,
  orgId?: number,
  rosterEntry?: ApiRosterEntry,
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditRosterEntryDialog = (props: EditRosterEntryDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, rosterEntry, onClose, onError,
  } = props;

  const existingRosterEntry: boolean = !!rosterEntry;
  const [firstName, setFirstName] = useState(rosterEntry?.firstName || '');
  const [lastName, setLastName] = useState(rosterEntry?.lastName || '');

  if (!open) {
    return <></>;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body = {
      firstName,
      lastName,
    };
    try {
      if (existingRosterEntry) {
        console.log('UPDATE');
        // await axios.put(`api/role/${orgId}/${rosterEntry!.edipi}`, body);
      } else {
        console.log('ADD');
        console.log(body);
        // await axios.post(`api/role/${orgId}`, body);
      }
    } catch (error) {
      if (onError) {
        let message = 'Internal Server Error';
        if (error.response?.data?.errors && error.response.data.errors.length > 0) {
          message = error.response.data.errors[0].message;
        }
        onError(message);
      }
      setFormDisabled(false);
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    return !formDisabled && firstName.length > 0 && lastName.length > 0;
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRosterEntry ? 'Edit Roster Entry' : 'New Roster Entry'}</DialogTitle>
      <DialogContent>
        <div>
          {existingRosterEntry ? `EDIPI: ${rosterEntry?.edipi}` : ''}
        </div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.editRosterEntryHeader}>First Name:</Typography>
            <TextField
              className={classes.textField}
              id="first-name"
              disabled={formDisabled}
              value={firstName}
              onChange={onInputChanged(setFirstName)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.editRosterEntryHeader}>Last Name:</Typography>
            <TextField
              className={classes.textField}
              id="last-name"
              disabled={formDisabled}
              value={lastName}
              onChange={onInputChanged(setLastName)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.editRosterEntryDialogActions}>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={!canSave()} onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

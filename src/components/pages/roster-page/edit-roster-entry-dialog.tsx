import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Checkbox,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import useStyles from './edit-roster-entry-dialog.style';
import { ApiRosterEntry, ApiRosterColumnInfo } from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

export interface EditRosterEntryDialogProps {
  open: boolean,
  orgId?: number,
  rosterColumnInfos?: ApiRosterColumnInfo[],
  rosterEntry?: ApiRosterEntry,
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditRosterEntryDialog = (props: EditRosterEntryDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, rosterColumnInfos, rosterEntry, onClose, onError,
  } = props;

  const [saveRosterEntryLoading, setSaveRosterEntryLoading] = useState(false);

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
      setSaveRosterEntryLoading(true);
      if (existingRosterEntry) {
        await axios.put(`api/roster/${orgId}/${rosterEntry!.edipi}`, body);
      } else {
        await axios.post(`api/roster/${orgId}`, body);
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
    } finally {
      setSaveRosterEntryLoading(false);
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    return !formDisabled && firstName.length > 0 && lastName.length > 0;
  };

  const getFieldForColumnType = (columnInfo: ApiRosterColumnInfo) => {
    switch (columnInfo.type) {
      case 'string':
        return (
          <TextField
            className={classes.textField}
            id={columnInfo.name}
            // TODO - disabled also if updatable is false
            disabled={formDisabled}
            value={lastName}
            onChange={onInputChanged(setLastName)}
          />
        );
      case 'boolean':
        return (
          <Checkbox
            defaultChecked={false}
          />
        );
      case 'date':
        return (
          <TextField
            id={columnInfo.name}
            type="date"
            value="2017-05-24"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      default:
        return '';
    }
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRosterEntry ? 'Edit Roster Entry' : 'New Roster Entry'}</DialogTitle>
      <DialogContent>
        <div>
          {existingRosterEntry ? `EDIPI: ${rosterEntry?.edipi}` : ''}
        </div>
        <Grid container spacing={3}>
          {rosterColumnInfos!.map(columnInfo => (
            <Grid key={columnInfo.displayName} item xs={6}>
              <Typography className={classes.editRosterEntryHeader}>{columnInfo.displayName}</Typography>
              {getFieldForColumnType(columnInfo)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.editRosterEntryDialogActions}>
        <Button disabled={formDisabled} variant="outlined" onClick={onClose} color="primary">
          Cancel
        </Button>
        <ButtonWithSpinner disabled={!canSave()} onClick={onSave} color="primary" loading={saveRosterEntryLoading}>
          Save
        </ButtonWithSpinner>
      </DialogActions>
    </Dialog>
  );
};

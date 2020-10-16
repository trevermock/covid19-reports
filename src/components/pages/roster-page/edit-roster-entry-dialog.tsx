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
import { ApiRosterColumnInfo, ApiRosterEntry } from '../../../models/api-response';
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
    open, orgId, rosterColumnInfos, onClose, onError,
  } = props;

  const [saveRosterEntryLoading, setSaveRosterEntryLoading] = useState(false);

  const existingRosterEntry: boolean = !!props.rosterEntry;
  const [rosterEntry, setRosterEntryProperties] = useState(existingRosterEntry ? props.rosterEntry as ApiRosterEntry : {} as ApiRosterEntry);

  if (!open) {
    return <></>;
  }

  function updateRosterEntryProperty(property: string, value: any) {
    setRosterEntryProperties({
      ...rosterEntry,
      [property]: value,
    });
  }

  const onTextFieldChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateRosterEntryProperty(event.target.id, event.target.value);
  };

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    updateRosterEntryProperty(event.target.id, checked);
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body = {
      rosterEntry,
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
    // TODO - check if we can save (all required fields have to be filled in)
    // return !formDisabled && firstName.length > 0 && lastName.length > 0;
    return true;
  };

  const buildFieldForColumnType = (columnInfo: ApiRosterColumnInfo) => {
    switch (columnInfo.type) {
      case 'string':
        return (
          // TODO - set an indication for if the field is required or not
          <TextField
            className={classes.textField}
            id={columnInfo.name}
            // TODO - disabled also if updatable is false
            disabled={formDisabled}
            value={rosterEntry[columnInfo.name]}
            onChange={onTextFieldChanged}
          />
        );
      case 'boolean':
        return (
          // TODO - set an indication for if the field is required or not
          <Checkbox
            id={columnInfo.name}
            color="primary"
            // TODO - disable also if updatable is false
            disabled={formDisabled}
            checked={rosterEntry[columnInfo.name]}
            onChange={onCheckboxChanged}
          />
        );
      case 'date':
        return (
          // TODO - set an indication for if the field is required or not
          <TextField
            id={columnInfo.name}
            type="date"
            value={rosterEntry[columnInfo.name]}
            // TODO - disable also if updatable is false
            disabled={formDisabled}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={onTextFieldChanged}
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
        <Grid container spacing={3}>
          {rosterColumnInfos!.map(columnInfo => (
            <Grid key={columnInfo.name} item xs={6}>
              <Typography className={classes.editRosterEntryHeader}>{columnInfo.displayName}</Typography>
              {buildFieldForColumnType(columnInfo)}
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

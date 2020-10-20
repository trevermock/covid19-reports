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
  TableRow,
  TableCell,
  Table,
  TableBody,
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
    try {
      setSaveRosterEntryLoading(true);
      if (existingRosterEntry) {
        await axios.put(`api/roster/${orgId}/${rosterEntry!.edipi}`, rosterEntry);
      } else {
        await axios.post(`api/roster/${orgId}`, rosterEntry);
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
    if (formDisabled) {
      return false;
    }

    let result = true;

    const requiredColumns = rosterColumnInfos?.filter(columnInfo => columnInfo.required);
    if (requiredColumns) {
      for (let i = 0; i < requiredColumns?.length; i++) {
        const value = rosterEntry[requiredColumns[i].name];
        if (!value || value.length === 0) {
          result = false;
          break;
        }
      }
    }

    return result;
  };


  const buildCheckboxFields = () => {
    const columns = rosterColumnInfos?.filter(columnInfo => columnInfo.type === 'boolean');
    return columns?.map(columnInfo => (
      <TableRow key={columnInfo.name}>
        <TableCell className={classes.textCell}>
          {columnInfo.displayName}
        </TableCell>
        <TableCell className={classes.iconCell}>
          <Checkbox
            color="primary"
            id={columnInfo.name}
            disabled={existingRosterEntry ? formDisabled || !columnInfo.updatable : false}
            checked={rosterEntry[columnInfo.name] || false}
            onChange={onCheckboxChanged}
          />
        </TableCell>
      </TableRow>
    ));
  };

  const buildTextInput = (columnInfo: ApiRosterColumnInfo) => {
    return (
      <TextField
        className={classes.textField}
        id={columnInfo.name}
        label={columnInfo.displayName}
        disabled={existingRosterEntry ? formDisabled || !columnInfo.updatable : false}
        required={columnInfo.required}
        onChange={onTextFieldChanged}
        value={rosterEntry[columnInfo.name] || ''}
        type="text"
      />
    );
  };

  const buildDateInput = (columnInfo: ApiRosterColumnInfo) => {
    return (
      <TextField
        className={classes.textField}
        id={columnInfo.name}
        label={columnInfo.displayName}
        disabled={existingRosterEntry ? formDisabled || !columnInfo.updatable : false}
        required={columnInfo.required}
        onChange={onTextFieldChanged}
        value={rosterEntry[columnInfo.name] ? rosterEntry[columnInfo.name].split('T')[0] || '' : ''}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  };

  const buildInputFields = () => {
    const columns = rosterColumnInfos?.filter(columnInfo => columnInfo.type !== 'boolean');
    return columns?.map(columnInfo => (
      <Grid key={columnInfo.name} item xs={6}>
        {columnInfo.type === 'date' ? buildDateInput(columnInfo) : buildTextInput(columnInfo)}
      </Grid>
    ));
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRosterEntry ? 'Edit Roster Entry' : 'New Roster Entry'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {buildInputFields()}
        </Grid>
        <label className={classes.booleanTableLabel}>Other:</label>
        <div className={classes.tableScroll}>
          <Table className={classes.booleanTable}>
            <TableBody>
              {buildCheckboxFields()}
            </TableBody>
          </Table>
        </div>
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

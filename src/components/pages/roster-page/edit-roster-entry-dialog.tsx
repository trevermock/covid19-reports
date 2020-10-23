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
} from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import MomentUtils from '@date-io/moment';
import axios from 'axios';
import useStyles from './edit-roster-entry-dialog.style';
import { ApiRosterColumnInfo, ApiRosterColumnType, ApiRosterEntry } from '../../../models/api-response';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';

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

  const onTextFieldChanged = (columnName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateRosterEntryProperty(columnName, event.target.value);
  };

  const onCheckboxChanged = (columnName: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    updateRosterEntryProperty(columnName, checked);
  };

  const onDateTimeFieldChanged = (columnName: string) => (date: MaterialUiPickersDate) => {
    updateRosterEntryProperty(columnName, date?.toISOString());
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
        } else {
          console.log(error);
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
    if (formDisabled || !rosterColumnInfos) {
      return false;
    }

    let result = true;

    const requiredColumns = rosterColumnInfos.filter(columnInfo => columnInfo.required);
    if (requiredColumns) {
      for (const column of requiredColumns) {

        if (rosterEntry[column.name] == null) {
          return false;
        }

        switch (column.type) {
          case ApiRosterColumnType.String:
          case ApiRosterColumnType.Date:
            if ((rosterEntry[column.name] as string).length === 0) {
              result = false;
            }
            break;
          default:
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
        <TableCell>
          {columnInfo.displayName}
        </TableCell>
        <TableCell>
          <Checkbox
            color="primary"
            id={columnInfo.name}
            disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
            checked={rosterEntry[columnInfo.name] as boolean || false}
            onChange={onCheckboxChanged(columnInfo.name)}
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
        disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
        required={columnInfo.required}
        onChange={onTextFieldChanged(columnInfo.name)}
        value={rosterEntry[columnInfo.name] || ''}
        type={columnInfo.type === ApiRosterColumnType.Number ? 'number' : 'text'}
      />
    );
  };

  const buildDateTimeInput = (columnInfo: ApiRosterColumnInfo) => {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          className={classes.textField}
          id={columnInfo.name}
          label={columnInfo.displayName}
          disabled={formDisabled || (existingRosterEntry && !columnInfo.updatable)}
          required={columnInfo.required}
          placeholder="mm/dd/yy hh:mm:ss"
          value={rosterEntry[columnInfo.name] as string}
          onChange={onDateTimeFieldChanged(columnInfo.name)}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const buildInputFields = () => {
    const columns = rosterColumnInfos?.filter(columnInfo => columnInfo.type !== 'boolean');
    return columns?.map(columnInfo => (
      <Grid key={columnInfo.name} item xs={6}>
        {buildInputFieldForColumnType(columnInfo)}
      </Grid>
    ));
  };

  const buildInputFieldForColumnType = (column: ApiRosterColumnInfo) => {
    switch (column.type) {
      case ApiRosterColumnType.String:
      case ApiRosterColumnType.Number:
        return buildTextInput(column);
      case ApiRosterColumnType.Date:
        return buildDateTimeInput(column);
      default:
        console.warn(`Unhandled column type found while creating input fields: ${column.type}`);
        return '';
    }
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingRosterEntry ? 'Edit Roster Entry' : 'New Roster Entry'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {buildInputFields()}
        </Grid>
        <label className={classes.booleanTableLabel}>Other:</label>
        <EditableBooleanTable aria-label="Other Fields">
          {buildCheckboxFields()}
        </EditableBooleanTable>
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

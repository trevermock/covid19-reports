import React, { useState } from 'react';
import {
  Button, Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import useStyles from './edit-column-dialog.styles';
import { ApiRosterColumnInfo, ApiRosterColumnType } from '../../../models/api-response';
import { EditableBooleanTable } from '../../tables/editable-boolean-table';

export interface EditColumnDialogProps {
  open: boolean,
  orgId?: number,
  column?: ApiRosterColumnInfo,
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditColumnDialog = (props: EditColumnDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, column, onClose, onError,
  } = props;

  const existingColumn: boolean = !!column;
  const [name, setName] = useState(column?.name || '');
  const [displayName, setDisplayName] = useState(column?.displayName || '');
  const [type, setType] = useState(column?.type || ApiRosterColumnType.String);
  const [pii, setPII] = useState(column?.pii || false);
  const [phi, setPHI] = useState(column?.phi || false);
  const [required, setRequired] = useState(column?.required || false);

  if (!open) {
    return <></>;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onColumnTypeChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as ApiRosterColumnType);
  };

  const onFlagChanged = (func: (f: boolean) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.checked);
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body = {
      name,
      displayName,
      type,
      pii: pii || phi,
      phi,
      required,
    };
    try {
      if (existingColumn) {
        await axios.put(`api/roster/column/${orgId}/${column!.name}`, body);
      } else {
        await axios.post(`api/roster/column/${orgId}`, body);
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
    return !formDisabled && name.length > 0 && displayName.length > 0;
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingColumn ? 'Edit Roster Column' : 'New Roster Column'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Field Name:</Typography>
            {existingColumn && (
              <Typography>
                {name}
              </Typography>
            )}
            {!existingColumn && (
              <TextField
                className={classes.textField}
                id="field-name"
                disabled={formDisabled}
                value={name}
                onChange={onInputChanged(setName)}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Type:</Typography>
            {existingColumn && (
              <Typography className={classes.typeText}>
                {type}
              </Typography>
            )}
            {!existingColumn && (
              <Select
                className={classes.typeSelect}
                native
                disabled={formDisabled}
                value={type}
                onChange={onColumnTypeChanged}
                inputProps={{
                  name: 'type',
                  id: 'type-select',
                }}
              >
                <option value={ApiRosterColumnType.String}>{ApiRosterColumnType.String}</option>
                <option value={ApiRosterColumnType.Number}>{ApiRosterColumnType.Number}</option>
                <option value={ApiRosterColumnType.Date}>{ApiRosterColumnType.Date}</option>
                <option value={ApiRosterColumnType.Boolean}>{ApiRosterColumnType.Boolean}</option>
              </Select>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Display Name:</Typography>
            <TextField
              className={classes.textField}
              id="display-name"
              disabled={formDisabled}
              multiline
              rowsMax={2}
              value={displayName}
              onChange={onInputChanged(setDisplayName)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Column Flags:</Typography>
            <EditableBooleanTable aria-label="Flags">
              <TableRow>
                <TableCell>Contains PII</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled || phi}
                    checked={pii || phi}
                    onChange={onFlagChanged(setPII)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contains PHI</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled}
                    checked={phi}
                    onChange={onFlagChanged(setPHI)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Required</TableCell>
                <TableCell>
                  <Checkbox
                    color="primary"
                    disabled={formDisabled}
                    checked={required}
                    onChange={onFlagChanged(setRequired)}
                  />
                </TableCell>
              </TableRow>
            </EditableBooleanTable>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
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

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, Select, Table, TableBody, TableCell, TableRow, TextField, Typography,
} from '@material-ui/core';
import axios from 'axios';
import CheckIcon from '@material-ui/icons/Check';
import useStyles from './edit-workspace-dialog.styles';
import { ApiWorkspace, ApiWorkspaceTemplate } from '../../../models/api-response';

export interface EditWorkspaceDialogProps {
  open: boolean,
  orgId?: number,
  workspace?: ApiWorkspace,
  templates?: ApiWorkspaceTemplate[],
  onClose?: () => void,
  onError?: (error: string) => void,
}

export const EditWorkspaceDialog = (props: EditWorkspaceDialogProps) => {
  const classes = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const {
    open, orgId, workspace, templates, onClose, onError,
  } = props;

  const existingWorkspace: boolean = !!workspace;
  const [name, setName] = useState(workspace?.name || '');
  const [description, setDescription] = useState(workspace?.description || '');
  const [templateId, setTemplateId] = useState(workspace?.workspaceTemplate?.id || ((templates && templates.length > 0) ? templates[0].id : -1));

  if (!open) {
    return <></>;
  }

  const onInputChanged = (func: (f: string) => any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    func(event.target.value);
  };

  const onWorkspaceTemplateChanged = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTemplateId(parseInt(event.target.value as string));
  };

  const getTemplateName = () => {
    const selectedTemplate = templates?.find(template => {
      return template.id === templateId;
    });
    return selectedTemplate?.name || 'None';
  };

  const getTemplateDescription = () => {
    const selectedTemplate = templates?.find(template => {
      return template.id === templateId;
    });
    return selectedTemplate?.description || 'No workspace template selected.';
  };

  const getTemplatePII = () => {
    const selectedTemplate = templates?.find(template => {
      return template.id === templateId;
    });
    return selectedTemplate?.pii || false;
  };

  const getTemplatePHI = () => {
    const selectedTemplate = templates?.find(template => {
      return template.id === templateId;
    });
    return selectedTemplate?.phi || false;
  };

  const onSave = async () => {
    setFormDisabled(true);
    const body = {
      name,
      description,
      templateId,
    };
    try {
      if (existingWorkspace) {
        await axios.put(`api/workspace/${orgId}/${workspace!.id}`, body);
      } else {
        await axios.post(`api/workspace/${orgId}`, body);
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
    }
    if (onClose) {
      onClose();
    }
  };

  const canSave = () => {
    return !formDisabled && name.length > 0 && description.length > 0;
  };

  return (
    <Dialog className={classes.root} maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="alert-dialog-title">{existingWorkspace ? 'Edit Workspace' : 'New Workspace'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Workspace Name:</Typography>
            <TextField
              className={classes.textField}
              id="workspace-name"
              disabled={formDisabled}
              value={name}
              onChange={onInputChanged(setName)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Workspace Description:</Typography>
            <TextField
              className={classes.textField}
              id="workspace-description"
              disabled={formDisabled}
              multiline
              rowsMax={2}
              value={description}
              onChange={onInputChanged(setDescription)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Template:</Typography>
            {existingWorkspace && (
              <Typography className={classes.templateText}>
                {getTemplateName()}
              </Typography>
            )}
            {!existingWorkspace && (
              <Select
                className={classes.templateSelect}
                native
                disabled={formDisabled || existingWorkspace}
                value={templateId}
                onChange={onWorkspaceTemplateChanged}
                inputProps={{
                  name: 'template',
                  id: 'template-select',
                }}
              >
                {templates && templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </Select>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Template Description:</Typography>
            <Typography className={classes.templateText}>
              {getTemplateDescription()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.headerLabel}>Template Data:</Typography>
            <Table aria-label="Permissions" className={classes.templateDataTable}>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.textCell}>Contains PII</TableCell>
                  <TableCell className={classes.iconCell}>
                    {getTemplatePII() && (
                      <CheckIcon />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.textCell}>Contains PHI</TableCell>
                  <TableCell className={classes.iconCell}>
                    {getTemplatePHI() && (
                      <CheckIcon />
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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

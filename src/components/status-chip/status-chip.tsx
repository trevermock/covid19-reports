import { Chip } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import useStyles from './status-chip.styles';

interface StatusChipProps {
  avatar?: React.ReactElement
  children?: null
  clickable?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  deleteIcon?: React.ReactElement
  disabled?: boolean
  icon?: React.ReactElement
  label?: React.ReactNode
  onDelete?: React.EventHandler<any>
  size?: 'small' | 'medium'
}

export const StatusChip = (props: StatusChipProps) => {
  const classes = useStyles();

  return (
    <Chip
      className={clsx({
        [classes.colorPrimary]: !props.color || props.color === 'primary',
        [classes.colorSecondary]: props.color === 'secondary',
        [classes.colorSuccess]: props.color === 'success',
        [classes.colorWarning]: props.color === 'warning',
        [classes.colorError]: props.color === 'error',
      })}
      avatar={props.avatar}
      clickable={props.clickable}
      deleteIcon={props.deleteIcon}
      disabled={props.disabled}
      icon={props.icon}
      label={props.label}
      onDelete={props.onDelete}
      size={props.size}
      variant="outlined"
    >
      {props.children}
    </Chip>
  );
};

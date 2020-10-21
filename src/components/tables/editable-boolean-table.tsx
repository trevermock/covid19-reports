import React from 'react';
import { Table, TableBody, TableProps } from '@material-ui/core';
import useStyles from './editable-boolean-table.styles';

export const EditableBooleanTable = (props: TableProps) => {
  const classes = useStyles();

  const isScroll = () => {
    return React.Children.count(props.children) > 7;
  };

  return (
    <div className={isScroll() ? classes.rootScroll : classes.rootNoScroll}>
      <div className={classes.booleanTable}>
        <Table
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        >
          <TableBody>
            {props.children}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

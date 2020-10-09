import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  table: {
    marginBottom: '39px',
  },
  tableHeader: {
    '& h2': {
      margin: 0,
      textTransform: 'none',
    },
  },
  accessRequestButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  accessRequestApproveButton: {
    width: '100%',
    backgroundColor: '#00A91C',
    '&:hover': {
      backgroundColor: '#008C17',
    },
  },
  accessRequestDenyButton: {
    width: '100%',
    backgroundColor: '#E41D3D',
    marginLeft: '5px',
    '&:hover': {
      backgroundColor: '#B6001D',
    },
  },
  roleSelect: {
    minWidth: '150px',
    marginTop: '15px',
    width: '100%',
  },
  roleDescription: {
    marginTop: '12px',
  },
  rolePermissionHeader: {
    padding: '3px 16px',
    backgroundColor: '#DEDEDE',
  },
  rolePermissionCell: {
    padding: '0px 16px',
    height: '32px',
    backgroundColor: '#F0F1F1',
  },
  rolePermissionIconCell: {
    padding: '0px 16px',
    height: '32px',
    textAlign: 'center',
    backgroundColor: '#EAEAEA',
    '& svg': {
      position: 'relative',
      top: '3px',
      color: theme.palette.primary.light,
    },
  },
  roleDialogActions: {
    justifyContent: 'center',
    backgroundColor: '#F0F1F1',
    padding: '15px 35px',
  },
}));

import { Button } from '@material-ui/core';
import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

export const HomePageMedical = () => {
  return (
    <div>
      <h1>Medical</h1>

      <a href="/dashboard">
        <Button variant="contained" color="primary">
          View Dashboard
        </Button>
      </a>

      <Alert severity="error" style={{marginBottom: '20px'}}>
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="warning" style={{marginBottom: '20px'}}>
        <AlertTitle>Warning</AlertTitle>
        This is a warning alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="info" style={{marginBottom: '20px'}}>
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity="success" style={{marginBottom: '20px'}}>
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </div>
  )
}

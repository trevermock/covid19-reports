import { Button } from '@material-ui/core';
import React from 'react';

export const HomePageBasic = () => {
  return (
    <div>
      <h1>Basic User</h1>

      <a href="/dashboard">
        <Button variant="contained" color="primary">
          Kibana
        </Button>
      </a>
    </div>
  )
}

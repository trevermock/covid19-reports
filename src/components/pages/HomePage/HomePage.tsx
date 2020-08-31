import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chart } from 'react-charts';
import { Button, Card, CardContent, Container } from '@material-ui/core';

import { User } from '../../../actions/userActions';
import { chartsDataMock } from '../../../mocks/chartsDataMock';
import { UserState } from '../../../reducers/userReducer';
import { AppState } from '../../../store';
import useStyles from './HomePage.styles';

export const HomePage = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();

  function handleAddClick() {
    // REDUX TEST
    dispatch(User.incrementCount());
  }

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <h1>Home</h1>
        <div style={{ display: 'flex' }}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <div style={{ flex: '1' }}>
                <Chart
                  data={chartsDataMock.lineChart.data}
                  axes={chartsDataMock.lineChart.axes}
                />
              </div>
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <div style={{ flex: '1' }}>
                <Chart
                  data={chartsDataMock.areaChart.data}
                  axes={chartsDataMock.areaChart.axes}
                  series={chartsDataMock.areaChart.series}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* REDUX TEST */}
        <h1>Count = {user.count}</h1>
        <Button variant="contained" color="primary" size="large" onClick={handleAddClick}>
          Add 1
        </Button>
      </Container>
    </main>
  )
};

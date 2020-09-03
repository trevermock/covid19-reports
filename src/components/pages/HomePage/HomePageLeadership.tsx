import React from 'react';
import { Chart } from 'react-charts';
import { Card, CardContent } from '@material-ui/core';

import { chartsDataMock } from '../../../mocks/chartsDataMock';
import useStyles from './HomePage.styles';

export const HomePageLeadership = () => {
  const classes = useStyles();

  return (
    <div>
      <h1>Leadership</h1>

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
    </div>
  )
}

export const chartsDataMock = {
  lineChart: {
    axes: [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    data: [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
  },
  areaChart: {
    series: {
      type: 'area'
    },
    axes: [
      { primary: true, position: 'bottom', type: 'time' },
      { position: 'left', type: 'linear', stacked: true }
    ],
    data: [
      {
        label: 'Series 1',
        datums: [
          {
            x: new Date('2020-03-18T11:00:00.000Z'),
            y: 60
          },
          {
            x: new Date('2020-03-18T11:30:00.000Z'),
            y: 23
          },
          {
            x: new Date('2020-03-18T12:00:00.000Z'),
            y: 65
          },
          {
            x: new Date('2020-03-18T12:30:00.000Z'),
            y: 84
          },
          {
            x: new Date('2020-03-18T13:00:00.000Z'),
            y: 87
          },
          {
            x: new Date('2020-03-18T13:30:00.000Z'),
            y: 84
          },
          {
            x: new Date('2020-03-18T14:00:00.000Z'),
            y: 96
          },
          {
            x: new Date('2020-03-18T14:30:00.000Z'),
            y: 88
          },
          {
            x: new Date('2020-03-18T15:00:00.000Z'),
            y: 63
          },
          {
            x: new Date('2020-03-18T15:30:00.000Z'),
            y: 60
          }
        ]
      },
      {
        label: 'Series 2',
        datums: [
          {
            x: new Date('2020-03-18T11:00:00.000Z'),
            y: 41
          },
          {
            x: new Date('2020-03-18T11:30:00.000Z'),
            y: 15
          },
          {
            x: new Date('2020-03-18T12:00:00.000Z'),
            y: 95
          },
          {
            x: new Date('2020-03-18T12:30:00.000Z'),
            y: 96
          },
          {
            x: new Date('2020-03-18T13:00:00.000Z'),
            y: 33
          },
          {
            x: new Date('2020-03-18T13:30:00.000Z'),
            y: 96
          },
          {
            x: new Date('2020-03-18T14:00:00.000Z'),
            y: 32
          },
          {
            x: new Date('2020-03-18T14:30:00.000Z'),
            y: 49
          },
          {
            x: new Date('2020-03-18T15:00:00.000Z'),
            y: 18
          },
          {
            x: new Date('2020-03-18T15:30:00.000Z'),
            y: 69
          }
        ]
      }
    ],
  }
};

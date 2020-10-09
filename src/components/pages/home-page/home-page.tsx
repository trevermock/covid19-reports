import React from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Card, CardActions, CardContent, Container, Grid, Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import useStyles from './home-page.styles';
import welcomeImage from '../../../media/images/welcome-image.png';

export const HomePage = () => {
  const user = useSelector<AppState, UserState>(state => state.user);
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Welcome */}
            <Card className={classes.card}>
              <CardContent>
                <Grid container direction="row">
                  <Grid item xs={8}>
                    <Typography variant="h5" gutterBottom>
                      Welcome to Status Engine
                    </Typography>

                    <Typography>
                      With Status Engine you can easily monitor COVID-19 cases across your entire organization. Easily
                      setup
                      daily symptom reports, monitor quarantine and non-outbreak scenarios, analyze long-term trends and
                      more!
                    </Typography>

                    <ul>
                      <li>
                        <Typography>
                          <strong>Save time</strong> over manual report generation and monitoring
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Keep a pulse on your <strong>force’s health and wellness</strong>
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          <strong>Track individuals&apos symptoms</strong> before, during and after their illness
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Easily monitor <strong>symptom checking compliance</strong>
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Access valuable data insights to make <strong>fact-based decisions</strong>
                        </Typography>
                      </li>
                    </ul>
                  </Grid>

                  <Grid item xs={4}>
                    <img src={welcomeImage} height="300" alt="Welcome" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics & Reporting */}
          {user.activeRole?.workspace && (
            <Grid item xs={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Analytics & Reporting
                  </Typography>

                  <Typography>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odque volutpat mm malesuada erat ut
                    tupendisse nibh, viverra non, semper suscipit, posuere a, pede.
                  </Typography>
                </CardContent>

                <CardActions>
                  <a href={`/dashboard?orgId=${user.activeRole.org?.id}`}>
                    <Button>
                      View Analytics
                    </Button>
                  </a>
                </CardActions>
              </Card>
            </Grid>
          )}

          {/* Roster Management */}
          {user.activeRole && user.activeRole.canManageRoster && (
            <Grid item xs={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Roster Management
                  </Typography>

                  <Typography>
                    Morbi in sem quis dui placerat ornare ellentesque odio nisi, euismod in, pharetra a, ultricies in,
                    diad arcuras consequ. Uguae, eu vulputate magna eroiquam erat volutptincidunt quirt.
                  </Typography>
                </CardContent>

                <CardActions>
                  <Link to="/roster">
                    <Button>
                      View Roster
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </main>
  );
};

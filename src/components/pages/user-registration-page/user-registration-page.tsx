import {
  Icon, MenuItem, Paper, TextField,
} from '@material-ui/core';
import {
  AssignmentOutlined, DoneAll, FavoriteBorder, LocalHospital, Timeline,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, UserRegisterData } from '../../../actions/user.actions';
import { UserState } from '../../../reducers/user.reducer';
import { AppState } from '../../../store';
import useStyles from './user-registration-page.styles';
import services from '../../../data/services';
import { ButtonWithSpinner } from '../../buttons/button-with-spinner';

export const UserRegistrationPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector<AppState, UserState>(state => state.user);
  const [inputData, setInputData] = useState<UserRegisterData>({
    firstName: '',
    lastName: '',
    phone: '',
    service: '',
    email: '',
  });

  function handleInputChange(key: keyof UserRegisterData, e: React.ChangeEvent<{ value: unknown }>) {
    setInputData({
      ...inputData,
      [key]: e.target.value as string,
    });
  }

  async function handleCreateAccountClick() {
    dispatch(User.setRegisterLoading(true));
    await dispatch(User.register(inputData));
    dispatch(User.setRegisterLoading(false));
  }

  function isCreateAccountButtonDisabled() {
    return (
      !inputData.firstName
      || !inputData.lastName
      || !inputData.phone
      || !inputData.service
      || !inputData.email
    );
  }

  return (
    <main className={classes.root}>
      <Paper className={classes.content}>
        <div className={classes.contentLeft}>
          <ul>
            <li>
              <Icon component={AssignmentOutlined} />
              Receive daily reports
            </li>
            <li>
              <Icon component={DoneAll} />
              Track symptom check compliance
            </li>
            <li>
              <Icon component={FavoriteBorder} />
              Monitor force health & wellness
            </li>
            <li>
              <Icon component={Timeline} />
              View and track trending data
            </li>
            <li>
              <Icon component={LocalHospital} />
              Monitor personnel mental health
            </li>
          </ul>
        </div>

        <div className={classes.contentRight}>
          <header className={classes.welcomeHeader}>
            <div>Welcome to Status Engine!</div>
            <p>
              Please take a moment to create your account. Once you have created an account you will be able to request
              access to your group.
            </p>
          </header>

          <form className={classes.form}>
            <div>
              <TextField
                id="firstName"
                label="First name"
                required
                onChange={e => handleInputChange('firstName', e)}
              />
              <TextField
                id="lastName"
                label="Last name"
                required
                onChange={e => handleInputChange('lastName', e)}
              />
            </div>
            <div>
              <TextField
                id="edipi"
                label="EDIPI"
                value={user.edipi}
                required
                disabled
              />
              <TextField
                id="phone"
                label="Phone number"
                required
                onChange={e => handleInputChange('phone', e)}
              />
            </div>
            <div>
              <TextField
                id="service"
                label="Service"
                select
                value={inputData.service}
                required
                onChange={e => handleInputChange('service', e)}
              >
                {services.map(serviceName => (
                  <MenuItem key={serviceName} value={serviceName}>
                    {serviceName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="email"
                label="Email"
                type="email"
                required
                onChange={e => handleInputChange('email', e)}
              />
            </div>
          </form>

          <ButtonWithSpinner
            className={classes.createAccountButton}
            size="large"
            onClick={handleCreateAccountClick}
            disabled={isCreateAccountButtonDisabled()}
            loading={user.isRegisterLoading}
          >
            Create Account
          </ButtonWithSpinner>
        </div>
      </Paper>
    </main>
  );
};

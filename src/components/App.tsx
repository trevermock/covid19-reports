import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { User } from "../actions/userActions";
import { AppFrameState } from "../reducers/appFrameReducer";
import { UserState } from "../reducers/userReducer";
import { AppState } from "../store";
import { AppFrame } from "./AppFrame/AppFrame";
import { HomePage } from "./pages/HomePage/HomePage";
import useStyles from "./App.styles";
import { RequestAccessPage } from "./pages/RequestAccessPage/RequestAccessPage";
import { RosterPage } from "./pages/RosterPage/RosterPage";
import { UserRegistrationPage } from "./pages/UserRegistrationPage/UserRegistrationPage";
import { UsersPage } from "./pages/UsersPage/UsersPage";
import { MusterPage } from "./pages/MusterPage/MusterPage";

export const App = () => {
  const user = useSelector<AppState, UserState>((state) => state.user);
  const appFrame = useSelector<AppState, AppFrameState>((state) => state.appFrame);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(User.login());
  }, [dispatch]);

  function routes() {
    if (!user.isLoggedIn) {
      // TODO: Show spinner here.
      return <></>;
    }

    if (!user.isRegistered) {
      return (
        <Switch>
          <Route path="/register">
            <UserRegistrationPage />
          </Route>
          <Redirect to="/register" />
        </Switch>
      );
    }

    if (!user.activeRole) {
      return (
        <Switch>
          <Route path="/request-access">
            <RequestAccessPage />
          </Route>
          <Redirect to="/request-access" />
        </Switch>
      );
    }

    return (
      <>
        <AppFrame />

        <div
          className={clsx(classes.content, {
            [classes.contentSidenavCollapsed]: !appFrame.sidenavExpanded,
            [classes.contentSidenavExpanded]: appFrame.sidenavExpanded,
          })}
        >
          <Switch>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/muster">
              <MusterPage />
            </Route>
            <Route path="/roster">
              <RosterPage />
            </Route>
            <Route path="/users">
              <UsersPage />
            </Route>
            <Route path="/*">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </div>
      </>
    );
  }

  return <>{routes()}</>;
};

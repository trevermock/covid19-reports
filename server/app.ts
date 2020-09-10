import express from 'express';
import 'express-async-errors';
import process from 'process';
import passport from 'passport';
import cookieParser from 'cookie-parser';
// import expressSession from 'express-session';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './api';
import kibanaProxy from './kibana';
import kibanaDashboard from './kibana/dashboard';
import database from './sqldb';
import config from './config/environment';
import { requireUserAuth } from "./auth";
import { errorHandler } from "./util/error";

database.then(() => {
  console.log('Database ready');
});

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const app = express();

//
// Middlware
//

app.use(requireUserAuth);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(expressSession({
//   resave: false,
//   saveUninitialized: false,
//   store: new TypeormStore({
//     cleanupLimit: 2,
//     ttl: 86400
//   }).connect(Session.repo),
//   secret: process.env.SESSION_SECRET,
// }))
app.use(passport.initialize());
app.use(passport.session())
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

// passport.serializeUser((user: User, done) => {
//   done(null, user.serialize())
// })
//
// passport.deserializeUser((userData: UserSerialized, done) => {
//   done(null, new User().deserialize(userData))
// })

//
// Routes
//
app.get('/heartbeat', (req: express.Request, res: express.Response) => {
  res.status(204).send();
});

app.use('/api', apiRoutes);
app.use('/dashboard', kibanaDashboard)
app.use(config.kibana.appPath, kibanaProxy);

app.get('/*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use(errorHandler);

//
// Start the server
//
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server ready at http://127.0.0.1:${PORT}`);
  }
});

export default app;

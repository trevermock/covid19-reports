import express from 'express';
import https from 'https';
import fs from 'fs';
import 'express-async-errors';
import process from 'process';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// import expressSession from 'express-session';
import morgan from 'morgan';
import apiRoutes from './api';

const opts = {
  key: fs.readFileSync('certs/server.key'),
  cert: fs.readFileSync( 'certs/server.crt'),
  requestCert: true,
  rejectUnauthorized: true,
  ca: [ fs.readFileSync('certs/ca.crt') ]
};

const app = express();

//
// Middlware
//
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
app.use('/api', apiRoutes);

app.use('/', express.static('../build'))

app.get('/$', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Covid19 Reports backend is running....',
  });
});

// Not found
app.all('*', (req: express.Request, res: express.Response) => {
  res.status(404).send({
    error: {
      message: 'Not found.',
      type: 'NotFound',
    },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  if (!res.headersSent) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({
      error: {
        message: err.message,
        stack: err.stack,
        type: err.type || 'InternalServerError',
      },
    });
  }

  next();
})

//
// Start the server
//
const PORT = process.env.PORT || 4000;
https.createServer(opts, app).listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server ready at https://localhost:${PORT}`);
  }
});

export default app;

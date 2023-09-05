import  createError from 'http-errors';
import  express, {Request, Response, NextFunction} from 'express';
import  path from 'path';
import  cookieParser from 'cookie-parser';
import  logger from 'morgan';
import db from './config/database.config';


import todorouter from './routes/todo';
import usersRouter from './routes/users';
import pageRouter from './routes/page';

const app = express();


db.sync().then(() => {
  console.log('Database connection established')
}).catch(err => {
  console.log(err);
})


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/todo', todorouter);
app.use('/users', usersRouter);
app.use('/', pageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err:createError.HttpError, req:Request, res:Response, next:NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

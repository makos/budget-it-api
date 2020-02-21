const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const recordsRouter = require('./routes/api/records');
const loginRouter = require('./routes/api/login');
const registerRouter = require('./routes/api/register');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.use(['/api/income', '/api/expenses'], recordsRouter);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({'Error (app)': err.message});
  console.log(err.stack);
});

module.exports = app;

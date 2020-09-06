const createError = require('http-errors'),
	express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	logger = require('morgan'),
	mongoose = require("mongoose"),
	dotenv = require('dotenv');

dotenv.config();

/**
 * Requiring Routes
 */
const indexRouter = require('./routes/index'),
	tradeRouter = require('./routes/trade'),
	holdingsRouter = require('./routes/holdings'),
	portfolioRouter = require('./routes/portfolio'),
	returnsRouter = require('./routes/returns'),
	errorsRouter = require('./routes/errors');

/**
 * Connect To DB
 */
let url = process.env.DATABASEURL || "mongodb://localhost/smallcase";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Use Routes
 */
app.use('/', indexRouter);
app.use('/trade', tradeRouter);
app.use('/holdings', holdingsRouter);
app.use('/portfolio', portfolioRouter);
app.use('/returns', returnsRouter);
app.use('*', errorsRouter);
//error route for all other request

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

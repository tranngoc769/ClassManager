// NOTE: to start the app, start the file /bin/www, NOT this app.js file!!!
// const createError = require('http-errors');
const session = require('express-session');


const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { sequelize } = require('./models');

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// view engine setup
var Telegram = require('./internal/telegram');
Telegram.init_bot()
const path = require('path')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', require('express-ejs-extend')); // add this line
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req, res, next) {
    const nonSecurePaths = ['/authen/signin', '/authen/login'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.session.loggedin != true && (req.session.username == "" || req.session.username == undefined) && (req.session.user_level * 1 == 0 || req.session.user_level == undefined)) {
        res.redirect('/authen/signin');
        return
    }
    next()
}

function admin_auth(req, res, next) {
    const nonSecurePaths = ['/authen/signin', '/authen/login'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.session.loggedin != true && (req.session.username == "" || req.session.username == undefined) && (req.session.user_level * 1 == 0 || req.session.user_level == undefined)) {
        return res.send({ "code": 403, "msg": "không thể xác thực" })
        return
    }
    next()
}

const indexRouter = require('./routes/index');
const authenRouter = require('./routes/authen');
const usersRouter = require('./routes/users');
const classesRouter = require('./routes/classes');
const groupsRouter = require('./routes/groups');
app.get('*', auth);
app.use('/', indexRouter);
app.use('/authen', authenRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/groups', groupsRouter);

(async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Successfully connected to the database');
    } catch (error) {
        console.log('Error occurred connecting to the database: ', error);
    }
})();

// catch 404 errors
app.use(function(req, res, next) {
    const err = new Error('The page you are looking for does not exist.🤷‍♂️');
    err.status = 404;
    next(err); // let the error handler below handle it further    
});
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
// catch all errors
app.use(function(err, req, res, next) {
    err.status = err.status || 500;
    console.log(`Error ${err.status} : ${err.message}`);

    // clean up the error message for the user
    err.message = (req.app.get('env') === 'development') ?
        err.message :
        'Sorry! There was an unexpected error on the server. 🙅‍♂️';

    // tell the browser what is going on
    res.status(err.status);

    // render the error page
    if (err.status === 404) {
        res.send("not found")
    } else {
        res.send("not success")
    }
});

var debug = require('debug')('project-08---sqllibrarymanager:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(3002);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
console.log("Listening " + port)
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
process.env.TZ = "Asia/Ho_Chi_Minh";

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
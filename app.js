const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const sql = require('sqlite3').verbose();
const dotenv = require('dotenv');
dotenv.config();

const localsMiddleware = require('./middleware/locals');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

app.use(localsMiddleware);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);

app.listen(process.env.PORT);
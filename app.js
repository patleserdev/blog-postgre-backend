require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var postCategoriesRouter = require('./routes/postCategories');
// const client = require ('./db')
const fileUpload = require('express-fileupload');



var app = express();
// Configuration CORS
const corsOptions = {
    origin: 'https://blog-postgre-frontend.vercel.app',
    // origin: ['http://localhost:3001'],
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,  // Permettre l'envoi des cookies ou des headers d'authentification
    optionsSuccessStatus: 200
  };
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/postcategories', postCategoriesRouter);

module.exports = app;

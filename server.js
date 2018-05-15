'use strict';

const express = require('express');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cookieParser());
const exphbs = require('express-handlebars');
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(express.static('public'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
}));
app.set('view engine', '.hbs');
app.use(fileUpload());

const routes = require('./routes');
app.use('/', routes);

const listener = app.listen(process.env.PORT || 4000, function () {
  logger.info(`dylangore-ca-2 started on port ${listener.address().port}`);
});

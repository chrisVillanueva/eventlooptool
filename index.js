'use strict';

const chalk = require('chalk');
//const app = require('./server');
const env = require('./config');
console.log(env);

if (env.isDev) {
  require('./webpack/dev-server');
  console.log("running dev server.")
} else {
	console.log("not running dev server.")
}

const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(env.PORT, () => {
  console.log(chalk.black.bgYellow(`Listening on http://localhost:${env.PORT}`));
});


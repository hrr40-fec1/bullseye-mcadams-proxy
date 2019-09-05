/* eslint-disable prefer-template */
require('dotenv').config();
const path = require('path');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));
app.get('/', (req, res) => res.send('OK'));

app.use(proxy('/api/product/', {
  target: 'http://localhost:3004/',
  pathRewrite: (pth, req) => {
    const params = req.headers.referer.split('?');
    const newPath = `${pth}?${params[1]}`;
    console.log('rewrite path', newPath);
    return newPath;
  },
}));
app.use(proxy('http://localhost:3002/api/checkout/'));
app.use(proxy('http://localhost:3001/api/'));

module.exports = app;

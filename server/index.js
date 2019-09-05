/* eslint-disable prefer-template */
require('dotenv').config();
const path = require('path');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));
app.get('/', (req, res) => res.send('OK'));

const updateQueryStringParameter = (pth, key, value) => {
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = pth.indexOf('?') !== -1 ? '&' : '?';
  if (pth.match(re)) {
    return pth.replace(re, '$1' + key + '=' + value + '$2');
  }
  return pth + separator + key + '=' + value;
};

app.use(proxy('/api/product/', {
  target: 'http://localhost:3004/',
  pathRewrite: (pth, req) => {
    const id = req.headers.referer.split('?productId=');
    let newPath = pth;
    newPath = updateQueryStringParameter(newPath, 'productId', id[1]);
    return newPath;
  },
}));
app.use(proxy('http://localhost:3002/api/checkout/'));
app.use(proxy('http://localhost:3001/api/'));

module.exports = app;

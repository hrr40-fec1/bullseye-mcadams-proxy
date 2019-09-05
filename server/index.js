require('dotenv').config();
const path = require('path');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));
app.get('/', (req, res) => res.send('OK'));
app.use(proxy('/api/product/', { target: 'http://localhost:3004' }));
app.use(proxy('/api/checkout/', { target: 'http://localhost:3002' }));
app.use(proxy('/api/', { target: 'http://localhost:3001' }));

module.exports = app;

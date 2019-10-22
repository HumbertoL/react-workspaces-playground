/* eslint-disable */
// We only need this server to proxy api requests for the external site. API requests will be called
// from javacript bundles in the client folder and will be made from the www.call-em-all.com
// domain.

'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');

const apiProxy = require('./api-proxy');

const app = express();

// trust the proxy so we can access to the X-Forwarded-For header using req.ip and req.ips
app.set('trust proxy', true);

app.set('port', process.env.PORT || 3100);
app.disable('x-powered-by');

// parse application/json
app.use(bodyParser.json());

// Production-specific settings
if (process.env.NODE_ENV === 'production') {
  console.log('\n');

  console.log('*** gzip compression enabled ***');
  app.use(require('compression')({ level: 9 }));

  console.log('*** Forced SSL redirects enabled ***');
  app.use(require('express-force-ssl'));
  app.set('forceSSLOptions', { trustXFPHeader: true });

  console.log('\n');
}

// This is done for every request
app.use(function(req, res, next) {
  // Set some logging
  if (process.env.NODE_ENV !== 'development') {
    console.log('%s %s - %s %s', req.method, req.url, req.ips, req.get('user-agent'));
  } else {
    // Don't log IP and UA in development environment
    console.log('%s %s', req.method, req.url);
  }

  next();
});

// This adds the Access-Control-Allow-Origin header to responses to account for CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// mount static
const staticOptions = {
  etag: true,
  lastModified: true,
};
app.use('/opt-out/static', express.static('../packages/opt-out/build/static', staticOptions));
app.use('/free-trial/static', express.static('../packages/free-trial/build/static', staticOptions));
app.use('/sign-up/static', express.static('../packages/sign-up/build/static', staticOptions));

// manifest is available without auth
app.get('/opt-out/asset-manifest.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../packages/opt-out/build/asset-manifest.json'));
});

app.get('/free-trial/asset-manifest.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../packages/free-trial/build/asset-manifest.json'));
});

app.get('/sign-up/asset-manifest.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../packages/sign-up/build/asset-manifest.json'));
});

// Proxy requests
app.use(apiProxy);

// start server
http.createServer(app).listen(app.get('port'), function() {
  console.log('CEA App started on port:', app.get('port'));
});

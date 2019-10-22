const express = require('express');
const path = require('path');
const request = require('request');
const NodeUUID = require('node-uuid');

// Local Variables
const apiUrl = process.env.API_URL;
const consumerKey = process.env.CONSUMER_KEY.toLowerCase();
const consumerSecret = process.env.CONSUMER_SECRET.toLowerCase();
const router = express.Router();

function prepareUrl(req) {
  const urlRaw = req.url.replace('/proxy', apiUrl);
  const optionsStart = urlRaw.indexOf('?');
  const url = optionsStart > -1
    ? urlRaw.substr(0, optionsStart)
    : urlRaw;
  return { url, urlRaw };
};

function createXForwardedForHeader(req) {
  // Build the X-Forwarded-For header for the out-going request.
  // Format is a comma+space delimited list of IP addresses.
  const xForwardedFor = req.ips.concat([req.connection.remoteAddress]);
  return xForwardedFor.join(', ');
}

function addStreamErrorHandlers(label, req, res, middle) {
  req.on('error', (err) => {
    console.log(`${label} request stream error event`, err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });

  middle.on('error', (err) => {
    console.log(`${label} proxy stream error event`, err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });

  res.on('error', (err) => {
    console.log(`${label} response error event`, err);
  });
}

router.route('/proxy*').all((req, res) => {
  const { url, urlRaw } = prepareUrl(req);
  const requestObject = {
    url: urlRaw,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token: NodeUUID.v4().toLowerCase(),
    },
    method: req.method,
    headers: {
      'oauth-library': 'oauth-sign',
      'User-Agent': req.get('user-agent'),
      'X-Forwarded-For': createXForwardedForHeader(req),
    },
    json: req.body,
  };
  const myRequest = request(requestObject);

  addStreamErrorHandlers('API request', req, res, myRequest);

  myRequest.pipe(res);
});

module.exports = router;

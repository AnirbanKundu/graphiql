/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

const express = require('express');
const graphqlHTTP = require('express-graphql');
const proxy = require('express-request-proxy');
const schema = require('./schema');
const app = express();
app.use(express.static(__dirname));

//app.use('/graphql', graphqlHTTP(() => ({ schema, graphiql: true })));
let stubService = 'http://localhost:4000';
app.use('/service/*', (req, res, next) => {
  proxy({
              url: stubService + '/*',
              timeout: parseInt(req.headers.timeout) || 10000,
              originalQuery: req.originalUrl.indexOf('?') >= 0
              // Don't sanitize query parameters (allow square braces to pass). But only enable if query params are present.
  })(req, res, next);
});

app.listen(0, function() {
  const port = this.address().port;
  console.log(`Started on http://localhost:${port}/`);
});
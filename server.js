var express = require('express');
var app = express();
var path = require('path');

// var webpackDevMiddleware = require("webpack-dev-middleware");
// var webpack = require("webpack");
// var compiler = webpack(require('./webpack.config.js'));

// Define the port to run on
app.set('port', 3000);


// app.use(webpackDevMiddleware(compiler, {
//   publicPath: "./public" // Same as `output.publicPath` in most cases.
// }));
app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
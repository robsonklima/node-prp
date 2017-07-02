var dbconfig = require("./config/dbconfig");
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();

var {allowCrossDomain} = require('./middleware/allowCrossDomain');
app.use(allowCrossDomain);

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool(dbconfig);
    self.configureExpress(pool);
}

REST.prototype.configureExpress = function(pool) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);

      var users_router = require("./routes/users");
      var users = new users_router(router, pool);

      var projects_router = require("./routes/projects");
      var projects = new projects_router(router, pool);

      var activities_router = require("./routes/activities");
      var activities = new activities_router(router, pool);

      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(process.env.PORT, function(){
          console.log("Nodejs up on port: " + process.env.PORT);
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new REST();

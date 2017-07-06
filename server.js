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

      var risk_categories_router = require("./routes/risk-categories");
      var risk_categories = new risk_categories_router(router, pool);

      var risk_types_router = require("./routes/risk-types");
      var risk_types = new risk_types_router(router, pool);

      var risks_router = require("./routes/risks");
      var risks = new risks_router(router, pool);

      var risk_identifications_router = require("./routes/risk-identifications");
      var risk_identifications = new risk_identifications_router(router, pool);

      var risk_problems_router = require("./routes/risk-problems");
      var risk_problems = new risk_problems_router(router, pool);

      var risk_reviews_router = require("./routes/risk-reviews");
      var risk_reviews = new risk_reviews_router(router, pool);

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

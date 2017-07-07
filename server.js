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

    var usersRouter = require("./routes/users");
    var users = new usersRouter(router, pool);

    var projectsRouter = require("./routes/projects");
    var projects = new projectsRouter(router, pool);

    var activitiesRouter = require("./routes/activities");
    var activities = new activitiesRouter(router, pool);

    var risk_categoriesRouter = require("./routes/risk-categories");
    var risk_categories = new risk_categoriesRouter(router, pool);

    var riskTypesRouter = require("./routes/risk-types");
    var riskTypes = new riskTypesRouter(router, pool);

    var risksRouter = require("./routes/risks");
    var risks = new risksRouter(router, pool);

    var risk_identificationsRouter = require("./routes/risk-identifications");
    var risk_identifications = new risk_identificationsRouter(router, pool);

    var risk_problemsRouter = require("./routes/risk-problems");
    var risk_problems = new risk_problemsRouter(router, pool);

    var riskReviewsRouter = require("./routes/risk-reviews");
    var riskReviews = new riskReviewsRouter(router, pool);

    var riskReviewReferencesRouter = require("./routes/risk-review-references");
    var riskReviewReferences = new riskReviewReferencesRouter(router, pool);

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

var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-categories", function(req, res) {
        var query = "SELECT * FROM ?? ORDER BY ?? ASC";
        var vars = ["risk_categories", "risk_category_name"];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_categories) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risk_categories});
                }
            });
        });
    });

}

module.exports = ROUTER;

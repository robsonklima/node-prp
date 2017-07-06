var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-types", function(req, res) {
        var query = "SELECT * FROM ?? ORDER BY ?? ASC";
        var vars = ["risk_types", "risk_type_name"];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_types) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risk_types});
                }
            });
        });
    });

}

module.exports = ROUTER;

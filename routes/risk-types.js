var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-types", function(req, res) {
        var query = `SELECT risk_type_id riskTypeId, risk_type_name riskTypeName
                      FROM ?? ORDER BY ?? ASC`;
        var vars = ["risk_types", "risk_type_name"];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, riskTypes) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  riskTypes});
                }
            });
        });
    });

}

module.exports = ROUTER;

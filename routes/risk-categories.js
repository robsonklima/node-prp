var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-categories", function(req, res) {
        var query = `SELECT risk_category_id riskCategoryId, risk_category_name riskCategoryName
                      FROM ?? ORDER BY ?? ASC`;
        var vars = ["risk_categories", "risk_category_name"];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, riskCategories) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  riskCategories});
                }
            });
        });
    });

}

module.exports = ROUTER;

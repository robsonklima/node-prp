var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-reviews/:user_id", function(req, res) {
        var query = `SELECT 		  ri.risk_identification_id
                          				, r.risk_id
                          				, r.risk_title
                          				, r.risk_cause
                          				, r.risk_effect
                          				, p.project_id
                          				, p.project_name
                          				, p.project_scope
                          				, a.activity_id
                          				, a.activity_title
                          				, u.user_id
                          				, u.user_name
                      FROM 		    risk_identifications ri
                      INNER JOIN	risks r on r.risk_id = ri.risk_id
                      LEFT JOIN	  projects p on p.project_id = ri.project_id
                      LEFT JOIN	  activities a on a.activity_id = ri.activity_id
                      INNER JOIN	users u on u.user_id = ri.user_id
                      WHERE		    u.user_id = ?
                      ORDER BY 	  r.risk_title, p.project_name`;
        var vars = [req.params.user_id];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_reviews) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risk_reviews});
                }
            });
        });
    });

}

module.exports = ROUTER;

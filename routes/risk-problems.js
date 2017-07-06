var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-problems/projects/:user_id/:risk_id", function(req, res) {
        var query = `SELECT 			p.project_id
                      				    , p.project_name
                      				    , (SELECT risk_identification_id FROM risk_identifications ri
                      						    WHERE ri.project_id = p.project_id AND ri.risk_id = ?
                      						    LIMIT 1) risk_identification_id
                      				    , (SELECT risk_problem_id FROM risk_problems rp
                      						    WHERE rp.risk_identification_id =
                      				           (SELECT risk_identification_id FROM risk_identifications ri
                      				              WHERE ri.project_id = p.project_id AND ri.risk_id = ?
                      				              LIMIT 1)
                      						    LIMIT 1) risk_problem_id
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.project_id = a.project_id
                      WHERE			  a.user_id = ?
                      AND				  (SELECT risk_identification_id FROM risk_identifications ri
                      				      WHERE ri.project_id = p.project_id AND ri.risk_id = ?
                      				      LIMIT  1) IS NOT NULL
                      GROUP BY 		p.project_id`;
        var vars = [req.params.risk_id, req.params.risk_id, req.params.user_id, req.params.risk_id];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, projects) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  projects});
                }
            });
        });
    });

    router.get("/risk-problems/activities/:user_id/:risk_id", function(req, res) {
        var query = `SELECT 			a.activity_id
                      				    , a.activity_title
                      				    , (SELECT risk_identification_id FROM risk_identifications ri
                      						    WHERE a.activity_id = ri.activity_id AND ri.risk_id = ?
                      						    LIMIT 1) risk_identification_id
                      				    , (SELECT risk_problem_id FROM risk_problems rp
                      						    WHERE rp.risk_identification_id =
                      				          (SELECT risk_identification_id FROM risk_identifications ri
                      							       WHERE a.activity_id = ri.activity_id AND ri.risk_id = ?
                      							       LIMIT 1)
                      						  LIMIT 1) risk_problem_id
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.project_id = a.project_id
                      WHERE			  a.user_id = ?
                      AND				  (SELECT risk_identification_id FROM risk_identifications ri
                      					    WHERE a.activity_id = ri.activity_id AND ri.risk_id = ?
                      					    LIMIT 1) IS NOT NULL
                      GROUP BY 		a.activity_id`;
        var vars = [req.params.risk_id, req.params.risk_id, req.params.user_id, req.params.risk_id];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, activities) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  activities});
                }
            });
        });
    });

    router.post("/risk-problems", function(req, res) {
        var query = "INSERT INTO ?? (??,??,risk_problem_added_date) VALUES (?,?,NOW())";
        var vars = ["risk_problems"
          , "risk_identification_id"
          , "user_id"
          , req.body.risk_identification_id
          , req.body.user_id
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "risk_problem": req.body});
                }
            });
        });
    });

    router.delete("/risk-problems/:risk_problem_id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risk_problems", "risk_problem_id", req.params.risk_problem_id];
        query = mysql.format(query,table);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else if (details.affectedRows == 0) {
                    res.status(404).send({"error": false, details });
                } else {
                    res.status(200).send({"error": false, details });
                }
            });
        });
    });

}

module.exports = ROUTER;

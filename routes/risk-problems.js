var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-problems/projects/:id_user/:id_risk", function(req, res) {
        var query = `SELECT 			p.id
                          				, p.name
                          				, (SELECT id FROM risk_identifications ri
                            					WHERE ri.id_project = p.id AND ri.id_risk = ?
                            					LIMIT 1) id_risk_identification
                          				, (SELECT id FROM risk_problems rp
                            					WHERE rp.id_risk_identification =
                                        (SELECT id FROM risk_identifications ri
                                          WHERE ri.id_project = p.id AND ri.id_risk = ?
                                          LIMIT 1)
                            					LIMIT 1) id_risk_problem
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.id = a.id_project
                      WHERE			  a.id_user = ?
                      AND				  (SELECT id FROM risk_identifications ri
                          				  WHERE ri.id_project = p.id AND ri.id_risk = ?
                          				  LIMIT  1) IS NOT NULL
                      GROUP BY 		p.id`;
        var vars = [req.params.id_risk, req.params.id_risk, req.params.id_user, req.params.id_risk];
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

    router.get("/risk-problems/activities/:id_user/:id_risk", function(req, res) {
        var query = `SELECT 			a.id
                          				, a.title
                          				, (SELECT id FROM risk_identifications ri
                            					WHERE a.id = ri.id_activity AND ri.id_risk = ?
                            					LIMIT 1) id_risk_identification
                          				, (SELECT id FROM risk_problems rp
                            					WHERE rp.id_risk_identification =
                                        (SELECT id FROM risk_identifications ri
                                					WHERE a.id = ri.id_activity AND ri.id_risk = ?
                                					LIMIT 1)
                            					LIMIT 1) id_risk_problem
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.id = a.id_project
                      WHERE			  a.id_user = ?
                      AND				  (SELECT id FROM risk_identifications ri
                                    WHERE a.id = ri.id_activity AND ri.id_risk = ?
                          				  LIMIT 1) IS NOT NULL
                      GROUP BY 		a.id`;
        var vars = [req.params.id_risk, req.params.id_risk, req.params.id_user, req.params.id_risk];
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
        var query = "INSERT INTO ?? (??,??,added_date) VALUES (?,?,NOW())";
        var vars = ["risk_problems"
          , "id_risk_identification"
          , "id_user"
          , req.body.id_risk_identification
          , req.body.id_user
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

    router.delete("/risk-problems/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risk_problems", "id", req.params.id];
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

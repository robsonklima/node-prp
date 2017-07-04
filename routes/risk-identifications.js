var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-identifications/projects/:id_user/:id_risk", function(req, res) {
        var query = `SELECT 			p.id
                      				    , p.name
                      				    , (SELECT id
                            					FROM risk_identifications ri
                            					WHERE ri.id_project = p.id
                            					AND ri.id_risk = ?) risk_identification_id
                      FROM 			projects p
                      INNER JOIN		activities a ON p.id = a.id_project
                      WHERE			a.id_user = ?
                      GROUP BY 		p.id`;
        var vars = [req.params.id_risk, req.params.id_user];
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

    router.get("/risk-identifications/activities/:id_user/:id_risk", function(req, res) {
        var query = `SELECT 			a.id
                      				    , a.title
                      				    , (SELECT id
                      					      FROM risk_identifications ri
                      					      WHERE ri.id_activity = a.id
                      					      AND ri.id_risk = ?) risk_identification_id
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.id = a.id_project
                      WHERE			  a.id_user = ?
                      GROUP BY 		a.id`;
        var vars = [req.params.id_risk, req.params.id_user];
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

    router.post("/risk-identifications", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??,??,added_date) VALUES (?,?,?,?,NOW())";
        var vars = ["risk_identifications"
          , "id_risk"
          , "id_project"
          , "id_activity"
          , "id_user"
          , req.body.id_risk
          , req.body.id_project
          , req.body.id_activity
          , req.body.id_user
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "risk_identification": req.body});
                }
            });
        });
    });

    router.delete("/risk-identifications/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risk-identifications", "id", req.params.id
        ];
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

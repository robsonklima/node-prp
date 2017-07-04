var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-identifications", function(req, res) {
        var query = `SELECT 		  ri.*, r.title risk_title, p.name project_name, a.title activity_title, u.name user_name
                      FROM 		    risk_identifications ri
                      LEFT JOIN	  risks r ON ri.id_risk = r.id
                      LEFT JOIN	  projects p ON ri.id_project = p.id
                      LEFT JOIN	  activities a ON ri.id_activity = a.id
                      LEFT JOIN	  users u ON ri.id_user = u.id`;
        query = mysql.format(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_identifications) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risk_identifications});
                }
            });
        });
    });

    router.get("/risk-identifications/me/:id_user", function(req, res) {
        var query = `SELECT 		  ri.*, r.title risk_title, p.name project_name, a.title activity_title, u.name user_name
                      FROM 		    risk_identifications ri
                      LEFT JOIN	  risks r ON ri.id_risk = r.id
                      LEFT JOIN	  projects p ON ri.id_project = p.id
                      LEFT JOIN	  activities a ON ri.id_activity = a.id
                      LEFT JOIN	  users u ON ri.id_user = u.id
                      WHERE       ri.id_user = ?`;
        var vars = [req.params.id_user];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_identifications) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risk_identifications});
                }
            });
        });
    });

    router.get("/risk-identifications/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["risk_identifications", "id", req.params.id];
        query = mysql.format(query,vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_identification) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, risk_identification});
                }
            });
        });
    });

    router.post("/risk-identifications", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??,??,??,added_date) VALUES (?,?,?,?,?,NOW())";
        var vars = ["risk_identifications"
          , "description"
          , "id_risk"
          , "id_project"
          , "id_activity"
          , "id_user"
          , req.body.description
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

    router.put("/risk-identifications/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["risk-identifications"
          , "description", req.body.description
          , "id_risk", req.body.id_risk
          , "id_project", req.body.id_project
          , "id_activity", req.body.id_activity
          , "id_user", req.body.id_user

          , "id", req.params.id
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else if (details.affectedRows == 0) {
                    res.status(400).send({"error": false, details });
                } else {
                    res.status(200).send({"error": false, details, "risk_identification": req.body });
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

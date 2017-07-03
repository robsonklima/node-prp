var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-identifieds", function(req, res) {
        var query = `SELECT ri.* FROM risk-identifieds ri WHERE	(1=1)`;
        query = mysql.format(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk_identifieds) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risk_identifieds});
                }
            });
        });
    });

    router.get("/risk-identifieds/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["risk_identifieds", "id", req.params.id];
        query = mysql.format(query,vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risk) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, risk});
                }
            });
        });
    });

    router.post("/risk-identifieds", function(req, res) {



        var query = "INSERT INTO ?? (??,??,??,??,??,added_date) VALUES (?,?,?,?,?,NOW())";
        var vars = ["risk_identifieds"
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

        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "risk_identified": req.body});
                }
            });
        });
    });

    router.put("/risk-identifieds/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["risk-identifieds"
          , "title", req.body.title
          , "cause", req.body.cause
          , "effect", req.body.effect
          , "id_risk_type", req.body.id_risk_type
          , "id_risk_category", req.body.id_risk_category

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
                    res.status(200).send({"error": false, details, "risk": req.body });
                }
            });
        });
    });

    router.delete("/risk-identifieds/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risk-identifieds", "id", req.params.id
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

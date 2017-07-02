var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risks", function(req, res) {
        var query = `SELECT 	r.*, rt.name risk_type_name, rc.name risk_category_name
                      FROM 	risks r, risk_types rt, risk_categories rc
                      WHERE	(1=1)
                      AND		r.id_risk_type = rt.id
                      AND		r.id_risk_category = rc.id`;
        query = mysql.format(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, risks) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  risks});
                }
            });
        });
    });

    router.get("/risks/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["risks", "id", req.params.id];
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

    router.post("/risks", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??,??,??,added_date) VALUES (?,?,?,?,?,NOW())";
        var vars = ["risks"
          , "title"
          , "cause"
          , "effect"
          , "id_risk_type"
          , "id_risk_category"
          , req.body.title
          , req.body.cause
          , req.body.effect
          , req.body.id_risk_type
          , req.body.id_risk_category
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "risk": req.body});
                }
            });
        });
    });

    router.put("/risks/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["risks"
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

    router.delete("/risks/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risks", "id", req.params.id
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

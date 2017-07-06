var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risks", function(req, res) {
        var query = `SELECT 	r.*, rt.risk_type_name , rc.risk_category_name
                      FROM 	risks r, risk_types rt, risk_categories rc
                      WHERE	(1=1)
                      AND		r.risk_type_id = rt.risk_type_id
                      AND		r.risk_category_id = rc.risk_category_id`;
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

    router.get("/risks/:risk_id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["risks", "risk_id", req.params.risk_id];
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
        var query = "INSERT INTO ?? (??,??,??,??,??,risk_added_date) VALUES (?,?,?,?,?,NOW())";
        var vars = ["risks"
          , "risk_title"
          , "risk_cause"
          , "risk_effect"
          , "risk_type_id"
          , "risk_category_id"
          , req.body.risk_title
          , req.body.risk_cause
          , req.body.risk_effect
          , req.body.risk_type_id
          , req.body.risk_category_id
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

    router.put("/risks/:risk_id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["risks"
          , "risk_title", req.body.risk_title
          , "risk_cause", req.body.risk_cause
          , "risk_effect", req.body.risk_effect
          , "risk_type_id", req.body.risk_type_id
          , "risk_category_id", req.body.risk_category_id

          , "risk_id", req.params.risk_id
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

    router.delete("/risks/:risk_id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risks", "risk_id", req.params.risk_id
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

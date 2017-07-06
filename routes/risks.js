var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risks", function(req, res) {
        var query = `SELECT  r.risk_id riskId
                             , r.risk_title riskTitle
                             , r.risk_cause riskCause
                             , r.risk_effect riskEffect
                             , r.risk_added_date riskAddedDate
                             , r.risk_category_id riskCategoryId
                             , rc.risk_category_name riskCategoryName
                             , r.risk_type_id riskTypeId
                             , rt.risk_type_name riskTypeName
                      FROM 	 risks r, risk_types rt, risk_categories rc
                      WHERE	 r.risk_type_id = rt.risk_type_id
                      AND	   r.risk_category_id = rc.risk_category_id`;
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
        var query = `SELECT  risk_id riskId
                             , risk_title riskTitle
                             , risk_cause riskCause
                             , risk_effect riskEffect
                             , risk_added_date riskAddedDate
                             , risk_type_id riskTypeId
                             , risk_category_id riskCategoryId
                      FROM   ??
                      WHERE ??=?`;
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
          , req.body.riskTitle
          , req.body.riskCause
          , req.body.riskEffect
          , req.body.riskTypeId
          , req.body.riskCategoryId
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

    router.put("/risks/:riskId", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["risks"
          , "risk_title", req.body.riskTitle
          , "risk_cause", req.body.riskCause
          , "risk_effect", req.body.riskEffect
          , "risk_type_id", req.body.riskTypeId
          , "risk_category_id", req.body.riskCategoryId

          , "risk_id", req.params.riskId
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

    router.delete("/risks/:riskId", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risks", "risk_id", req.params.riskId
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

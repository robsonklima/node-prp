var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/activities", function(req, res) {
        var query = `SELECT 	a.*, p.project_name, u.user_name
                      FROM 	activities a, projects p, users u
                      WHERE 	a.project_id = p.project_id and a.user_id = u.user_id`;
        query = mysql.format(query);
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

    router.get("/activities/:activity_id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["activities", "activity_id", req.params.activity_id];
        query = mysql.format(query,vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, activity) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, activity});
                }
            });
        });
    });

    router.post("/activities", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??,??,??,added_date) VALUES (?,?,?,?,?,NOW())";
        var vars = ["activities"
          , "activity_title"
          , "activity_details"
          , "activity_amount_hours"
          , "project_id"
          , "user_id"
          , req.body.activity_title
          , req.body.activity_details
          , req.body.activity_amount_hours
          , req.body.project_id
          , req.body.user_id
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "activity": req.body});
                }
            });
        });
    });

    router.put("/activities/:activity_id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["activities"
          , "activity_title", req.body.activity_title
          , "activity_details", req.body.activity_details
          , "activity_amount_hours", req.body.activity_amount_hours
          , "project_id", req.body.project_id
          , "user_id", req.body.user_id

          , "activity_id", req.params.activity_id
        ];
        query = mysql.format(query, vars);

        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else if (details.affectedRows == 0) {
                    res.status(400).send({"error": false, details });
                } else {
                    res.status(200).send({"error": false, details, "user": req.body });
                }
            });
        });
    });

    router.delete("/activities/:activity_id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["activities", "activity_id", req.params.activity_id
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

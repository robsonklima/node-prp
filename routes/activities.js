var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/activities", function(req, res) {
        var query = `SELECT a.*, p.name project_name, u.name user_name
                      FROM activities a, projects p, users u
                      WHERE a.id_project = p.id and a.id_user = u.id`;
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

    router.get("/activities/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["activities", "id", req.params.id];
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
          , "title"
          , "details"
          , "amount_hours"
          , "id_project"
          , "id_user"
          , req.body.title
          , req.body.details
          , req.body.amount_hours
          , req.body.id_project
          , req.body.id_user
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

    router.put("/activities/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["activities"
          , "title", req.body.title
          , "details", req.body.details
          , "amount_hours", req.body.amount_hours
          , "id_project", req.body.id_project
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
                    res.status(200).send({"error": false, details, "user": req.body });
                }
            });
        });
    });

    router.delete("/activities/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["activities", "id", req.params.id
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

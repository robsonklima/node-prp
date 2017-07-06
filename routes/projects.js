var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/projects", function(req, res) {
        var query = `SELECT 		p.*, count(a.activity_id) project_amount_activities
                      FROM 		  projects p
                      LEFT JOIN	activities a on p.project_id = a.project_id
                      GROUP BY 	p.project_id
                      ORDER BY 	p.project_name ASC`;
        query = mysql.format(query);
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

    router.get("/projects/:project_id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["projects", "project_id", req.params.project_id];
        query = mysql.format(query,vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, project) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, project});
                }
            });
        });
    });

    router.post("/projects", function(req, res) {
        var query = "INSERT INTO ?? (??,??,project_added_date) VALUES (?,?,NOW())";
        var vars = ["projects"
          , "project_name"
          , "project_scope"
          , req.body.project_name
          , req.body.project_scope
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "project": req.body});
                }
            });
        });
    });

    router.put("/projects/:project_id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["projects"
          , "project_name", req.body.project_name
          , "project_scope", req.body.project_scope

          , "project_id", req.params.project_id
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
                    res.status(200).send({"error": false, details, "project": req.body });
                }
            });
        });
    });

    router.delete("/projects/:project_id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["projects", "project_id", req.params.project_id
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

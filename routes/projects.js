var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/projects", function(req, res) {
        var query = `SELECT 		p.*, count(a.id) amount_activities
                      FROM 		projects p
                      LEFT JOIN	activities a on p.id = a.id_project
                      GROUP BY 	p.id
                      ORDER BY 	p.name ASC`;
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

    router.get("/projects/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["projects", "id", req.params.id];
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
        var query = "INSERT INTO ?? (??,??,added_date) VALUES (?,?,NOW())";
        var vars = ["projects"
          , "name"
          , "scope"
          , req.body.name
          , req.body.scope
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

    router.put("/projects/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["projects"
          , "name", req.body.name
          , "scope", req.body.scope

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

    router.delete("/projects/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["projects", "id", req.params.id
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

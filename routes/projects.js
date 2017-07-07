var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/projects", function(req, res) {
        var query = `SELECT 	p.project_id projectId
                                , p.project_name projectName
                                , p.project_scope projectScope
                                , p.project_added_date projectAddedDate
                                , count(a.activity_id) projectAmountActivities
                      FROM 		  projects p
                      LEFT JOIN	activities a on p.project_id = a.project_id
                      GROUP BY 	p.project_id
                      ORDER BY 	p.project_name`;
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

    router.get("/projects/:projectId", function(req, res) {
        var query = `SELECT   project_id projectId
                              , project_name projectName
                              , project_scope projectScope
                              , project_added_date projectAddedDate
                              FROM ?? WHERE ??=?`;
        var vars = ["projects", "project_id", req.params.projectId];
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
          , "project_name", "project_scope", req.body.projectName, req.body.projectScope
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

    router.put("/projects/:projectId", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["projects"
          , "project_name", req.body.projectName
          , "project_scope", req.body.projectScope

          , "project_id", req.params.projectId
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

    router.delete("/projects/:projectId", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["projects", "project_id", req.params.projectId
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
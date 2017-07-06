var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/activities", function(req, res) {
        var query = `SELECT 	  a.activity_id activityId
                                , a.activity_title activityTitle
                                , a.activity_details activityDetails
                                , a.activity_amount_hours activityAmountHours
                                , a.activity_added_date activityAddedDate
                                , a.project_id projectId
                                , a.user_id userId
                                , p.project_name projectName
                                , u.user_name userName
                      FROM 	    activities a, projects p, users u
                      WHERE 	  a.project_id = p.project_id and a.user_id = u.user_id
                      ORDER BY  a.activity_title`;
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

    router.get("/activities/:activityId", function(req, res) {
        var query = `SELECT   activity_id activityId
                              , activity_title activityTitle
                              , activity_details activityDetails
                              , activity_amount_hours activityAmountHours
                              , activity_added_date activityAddedDate
                              , project_id projectId
                              , user_id userId
                              FROM ?? WHERE ??=?`;
        var vars = ["activities", "activity_id", req.params.activityId];
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
        var query = "INSERT INTO ?? (??,??,??,??,??,activity_added_date) VALUES (?,?,?,?,?,NOW())";
        var vars = ["activities"
          , "activity_title"
          , "activity_details"
          , "activity_amount_hours"
          , "project_id"
          , "user_id"
          , req.body.activityTitle
          , req.body.activityDetails
          , req.body.activityAmountHours
          , req.body.projectId
          , req.body.userId
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

    router.put("/activities/:activityId", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["activities"
          , "activity_title", req.body.activityTitle
          , "activity_details", req.body.activityDetails
          , "activity_amount_hours", req.body.activityAmountHours
          , "project_id", req.body.projectId
          , "user_id", req.body.userId

          , "activity_id", req.params.activityId
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

    router.delete("/activities/:activityId", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["activities", "activity_id", req.params.activityId
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

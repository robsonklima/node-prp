var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-identifications/projects/:userId/:riskId", function(req, res) {
        var query = `SELECT 			p.project_id projectId
                      				    , p.project_name projectName
                      				    , (SELECT  risk_identification_id
                          						FROM   risk_identifications ri
                          						WHERE  ri.project_id = p.project_id
                          						AND    ri.risk_id = ?
                      			          LIMIT  1) riskIdentificationId
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.project_id = a.project_id
                      WHERE			  a.user_id = ?
                      GROUP BY 		p.project_id`;
        var vars = [req.params.riskId, req.params.userId];
        query = mysql.format(query, vars);
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

    router.get("/risk-identifications/activities/:userId/:riskId", function(req, res) {
        var query = `SELECT 			a.activity_id activityId
                      				    , a.activity_title activityTitle
                      				    , (SELECT  risk_identification_id
                          					  FROM   risk_identifications ri
                          					  WHERE  ri.activity_id = a.activity_id
                          					  AND    ri.risk_id = ?
                      			          LIMIT  1) riskIdentificationId
                      FROM 			  projects p
                      INNER JOIN	activities a ON p.project_id = a.project_id
                      WHERE			  a.user_id = ?
                      GROUP BY 		a.activity_id`;
        var vars = [req.params.riskId, req.params.userId];
        query = mysql.format(query, vars);
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

    router.post("/risk-identifications", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??,??,risk_identification_added_date) VALUES (?,?,?,?,NOW())";
        var vars = ["risk_identifications"
          , "risk_id"
          , "project_id"
          , "activity_id"
          , "user_id"
          , req.body.riskId
          , req.body.projectId
          , req.body.activityId
          , req.body.userId
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "risk_identification": req.body});
                }
            });
        });
    });

    router.delete("/risk-identifications/:riskIdentificationId", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["risk_identifications", "risk_identification_id", req.params.riskIdentificationId];
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

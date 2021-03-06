var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-reviews/:userId", function(req, res) {
        var query = `SELECT 		  	ri.risk_identification_id riskIdentificationId
                            				, r.risk_id riskId
                            				, r.risk_title riskTitle
                            				, r.risk_cause riskCause
                            				, r.risk_effect riskEffect
                            				, p.project_id projectId
                            				, p.project_name projectName
                            				, p.project_scope projectScope
                            				, a.activity_id activityId
                            				, a.activity_title activityTitle
                            				, u.user_id userId
                            				, u.user_name userName
                            				, rr.risk_review_date_added riskReviewDateAdded
                      FROM 		      risk_identifications ri
                      INNER JOIN		risks r on r.risk_id = ri.risk_id
                      LEFT JOIN	  	projects p on p.project_id = ri.project_id
                      LEFT JOIN	  	activities a on a.activity_id = ri.activity_id
                      INNER JOIN		users u on u.user_id = ri.user_id
                      LEFT JOIN		  risk_reviews rr ON rr.risk_identification_id = ri.risk_identification_id
                      WHERE		      u.user_id = ?
                      ORDER BY 	  	r.risk_title, p.project_name`;
        var vars = [req.params.userId];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, riskReviews) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  riskReviews});
                }
            });
        });
    });

    router.post("/risk-reviews", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??,??,??,??,??,risk_review_date_added) VALUES (?,?,?,?,?,?,?,NOW())";
        var vars = ["risk_reviews"
          , "risk_review_cost"
          , "risk_review_schedule"
          , "risk_review_scope"
          , "risk_review_quality"
          , "risk_review_probability"
          , "risk_identification_id"
          , "user_id"
          , req.body.riskReviewCost
          , req.body.riskReviewSchedule
          , req.body.riskReviewScope
          , req.body.riskReviewQuality
          , req.body.riskReviewProbability
          , req.body.riskIdentificationId
          , req.body.userId
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "riskReview": req.body});
                }
            });
        });
    });

}

module.exports = ROUTER;

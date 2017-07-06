var mysql = require("mysql");

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/risk-review-references/", function(req, res) {
        var query = `SELECT  risk_review_references_id riskReviewReferenceId
                      			 , risk_review_references_title riskReviewReferenceTitle
                      			 , risk_review_references_type riskReviewReferenceType
                      			 , risk_review_references_weight riskReviewReferenceWeight
                      FROM 	 risk_review_references`;
        query = mysql.format(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, riskReviewReferences) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  riskReviewReferences});
                }
            });
        });
    });
}

module.exports = ROUTER;

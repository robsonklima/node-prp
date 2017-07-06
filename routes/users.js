var mysql = require("mysql");
var md5 = require('md5');

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/users", function(req, res) {
        var query = `SELECT   user_id userId
                              , user_name userName
                              , user_email userEmail
                              , user_password userPassword
                      FROM ??`;
        var vars = ["users"];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, users) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  users});
                }
            });
        });
    });

    router.get("/users/:user_id", function(req, res) {
        var query = `SELECT  user_id userId
                             , user_name userName
                             , user_email userEmail
                             , user_password userPassword
                      FROM ?? WHERE ??=?`;
        var vars = ["users", "id", req.params.user_id];
        query = mysql.format(query,vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, user) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false,  user});
                }
            });
        });
    });

    router.post("/users", function(req, res) {
        var query = "INSERT INTO ?? (??,??,??) VALUES (?,?,?)";
        var vars = ["users"
          , "user_name", "user_email", "user_password"
          , req.body.user_name, req.body.user_email, md5(req.body.user_password)
        ];
        query = mysql.format(query, vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err});
                } else {
                    res.status(200).send({"error": false, details, "user": req.body});
                }
            });
        });
    });

    router.post("/users/me", function(req, res) {
        var query = `SELECT user_id userId
                             , user_name userName
                             , user_email userEmail
                             , user_password userPassword
                      FROM ?? WHERE ??=? AND ??=?`;
        var vars = ["users"
          , "user_email", req.body.userEmail
          , "user_password", md5(req.body.userPassword)
        ];
        query = mysql.format(query,vars);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, details) {
                connection.release();
                if(err) {
                    res.status(400).send({"error": true, "details": err });
                } else if (details.length == 0) {
                    res.status(400).send({"error": false });
                } else {
                    res.status(200).send({"error": false, "user": details[0] });
                }
            });
        });
    });

    router.put("/users/profile/:userId", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["users"
          , "user_email", req.body.userEmail
          , "user_name", req.body.userName

          , "user_id", req.params.userId
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

    router.put("/users/password/:userId", function(req, res) {
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var vars = ["users", "user_password", md5(req.body.userPassword)
          , "userid", req.params.userId
        ];
        query = mysql.format(query, vars);
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

    router.delete("/users/:userId", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["users", "user_id", req.params.userId
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

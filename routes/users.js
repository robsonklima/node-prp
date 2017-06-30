var mysql = require("mysql");
var md5 = require('md5');

function ROUTER(router, pool) {
    var self = this;
    self.handleRoutes(router, pool);
}

ROUTER.prototype.handleRoutes = function(router, pool) {
    var self = this;

    router.get("/users", function(req, res) {
        var query = "SELECT * FROM ??";
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

    router.get("/users/:id", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var vars = ["users", "id", req.params.id];
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
          , "name", "email", "password"
          , req.body.name, req.body.email, md5(req.body.password)
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
        var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
        var vars = ["users"
          , "email", req.body.email
          , "password", md5(req.body.password)
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

    router.put("/users/profile/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var vars = ["users"
          , "email", req.body.email
          , "name", req.body.name

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

    router.put("/users/password/:id", function(req, res) {
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var vars = ["users", "password", md5(req.body.password)
          , "id", req.params.id
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

    router.delete("/users/:id", function(req, res) {
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["users", "id", req.params.id
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

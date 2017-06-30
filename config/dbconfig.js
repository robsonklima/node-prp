var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

switch(env) {
    case 'development':
        process.env.PORT = 3000;

        var dbconfig = {
            connectionLimit : 100,
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'prp',
            debug    :  false
        };
        break;
    case "test":
        // to do
        break;
    default:
        var dbconfig = {
            connectionLimit : 100,
            host     : 'us-cdbr-iron-east-03.cleardb.net',
            user     : 'b81980c4d2abcf',
            password : '7dfd7fcd',
            database : 'heroku_92023a243cf1902',
            debug    :  false
        };
}

module.exports = dbconfig;

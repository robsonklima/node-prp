var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

switch(env) {
    case 'development':
        process.env.PORT = 3000;

        var dbconfig = {
            connectionLimit : 100,
            host     : '127.0.0.1',
            user     : 'root',
            password : 'Rkl@2015',
            database : 'prp',
            debug    :  false
        };
        break;
    case "test":
        // to do
        break;
    default:
        // blooming-anchorage-34827
        var dbconfig = {
            connectionLimit : 100,
            host     : 'us-cdbr-iron-east-03.cleardb.net',
            user     : 'ba696071e24aa5',
            password : '7787d06f',
            database : 'heroku_b6000df02e9dd77',
            debug    :  false
        };
}

module.exports = dbconfig;

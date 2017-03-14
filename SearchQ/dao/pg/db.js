/**
 * http://usejsdoc.org/
 */
var pg = require('pg');
var config = {
		  user: 'postgres', //env var: PGUSER
		  database: 'orderQ', //env var: PGDATABASE
		  password: '111111', //env var: PGPASSWORD
		  host: 'localhost', // Server hosting the postgres database
		  port: 5432, //env var: PGPORT
		  max: 10, // max number of clients in the pool
		  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
		};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
// if an error is encountered by a client while it sits idle in the pool
// the pool itself will emit an error event with both the error and
// the client which emitted the original error
// this is a rare occurrence but can happen if there is a network partition
// between your application and the database, the database restarts, etc.
// and so you might want to handle it and at least log it out
console.error('idle client error', err.message, err.stack)
})

module.exports = pool;
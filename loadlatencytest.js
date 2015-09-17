/* concurrentLoadQuery */

//
// export TRIREME_CLASSPATH=$PWD/drivers/hsqldb-2.3.2.jar
//

var when = require('when');
var _ = require('lodash');
var poolModule = require('generic-pool');
var pipeline = require("when/pipeline");
var JDBC = require('JDBC');
 
var config = {
  libpath: '/Users/xtong/Downloads/dbeaver/plugins/snowflake_jdbc.jar',
  drivername: 'com.snowflake.client.jdbc.SnowflakeDriver',
  url: 'jdbc:snowflake://zuora.snowflakecomputing.com:443/?ssl=on&user=xtong&account=zuora&warehouse=ZAN&db=ZAN100&schema=PUBLIC',
  // optionally   
  user: 'xtong',
  password: 'zuora123456',
};


var pool = poolModule.Pool({
    name     : 'snowflakePool',
    create   : function(callback) {
		var jdbc = new JDBC();
		jdbc.initialize(config, function(err, res) {
		  if (err) {
		    console.log(err);
		  }
		});
    	jdbc.open(function(err,conn){
    		callback(err, jdbc);
    	});
        // parameter order: err, resource
        // new in 1.0.6
    },
    destroy  : function(client) { client.close(function(){}); },
    max      : 40,
    // optional. if you set this, make sure to drain() (see step 3)
    min      : 15, 
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 100000,
     // if true, logs via console.log - can also be a function
    log : true,
    priorityRange : 3
});


var queryTimes = [];
var currentID = 0;



var query = function(){
	console.log("[INFO] Poolsize: ", pool.getPoolSize());

	pool.acquire(function(err, client){
		var sendTime = process.hrtime();

		client.executeQuery("SELECT COUNT(1) from TESTTB", function(err, output){
			console.log(output[0]['COUNT(1)']);
			var timestamp = process.hrtime();
			var o = {
				count: output[0]['COUNT(1)'],
				end: (timestamp[0] + timestamp[1]/(1000000000)),
				begin: (sendTime[0] + sendTime[1]/1000000000 )
			};
			queryTimes.push(o);
			// [num of counts] --> [time received, time sent]
			pool.release(client);
		});
	}, 1); //MEDIUM PRIORITY = 1;
}

var qQ = setInterval(query, 800); 

var report = function(){
	clearInterval(qQ);

	setTimeout(function(){
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(JSON.stringify(queryTimes));
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
	}, 12000)
};

setTimeout(report, 120000) //report after 1.2 seconds.


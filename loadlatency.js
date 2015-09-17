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


var loadTimes = {};
var queryTimes = {};
var currentID = 0;

var N = 500; //1000 Records per INSERT operation.

function randomString (strLength) {
    var result = "";
    charSet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
    while (--strLength) {
            result += charSet[Math.floor(Math.random() * charSet.length)];
    }
    return result;
}



var insert = function(){

	pool.acquire(function(err, client){

		var insertStatement = "";
		for (var i = 0; i < N; i++){
			currentID ++;
			insertStatement += "("+currentID+",'"+randomString(8)+"','"+randomString(8)+"'),";
		}
		insertStatement = insertStatement.slice(0, -1);
		//Upsert started here.
		var timestamp = process.hrtime();
		loadTimes[currentID+N] = [timestamp[0] + timestamp[1]/(1000000000)]; //record...
		client.executeUpdate("INSERT INTO TESTTB VALUES "+ insertStatement+";", function(err, rowsInserted){
			if(err || rowsInserted != N){
				console.error("Mismatch in insertion? Insertion Error", err, rowsInserted);
			}
			pool.release(client);
		});
	}, 0); //HIGHEST PRIORITY = 0;
};

var iQ = setInterval(insert,1000); 

var report = function(){
	clearInterval(iQ);
	setTimeout(function(){
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(JSON.stringify(loadTimes));
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
		console.log(" - - - - - - - - - - -");
	}, 12000)
};

setTimeout(report, 120000) //report after 1.2 seconds.


/* concurrentLoadQuery */

//
// export TRIREME_CLASSPATH=$PWD/drivers/hsqldb-2.3.2.jar
//

var when = require('when');
var _ = require('lodash');
var poolModule = require('generic-pool');
var pipeline = require("when/pipeline");
var mysql = require('mysql');
 
var config = {
  host: 'ec2-54-68-167-99.us-west-2.compute.amazonaws.com',
  user: 'root',
  password: 'password',
  database: 'zan_pt11',
  connectTimeout: 60000,
  connectionLimit: 5
};

var pool = mysql.createPool(config);

var queryTimes = [];
var currentID = 0;



var query = function(){

	pool.getConnection(function(err, client){
		var sendTime = process.hrtime();

		client.query("SELECT COUNT(1) from TESTTB", function(err, output){
			console.log(output[0]['COUNT(1)']);
			var timestamp = process.hrtime();
			var o = {
				count: output[0]['COUNT(1)'],
				end: (timestamp[0] + timestamp[1]/(1000000000)),
				begin: (sendTime[0] + sendTime[1]/1000000000 )
			};
			queryTimes.push(o);
			// [num of counts] --> [time received, time sent]
			client.release();
		});
	}, 1); //MEDIUM PRIORITY = 1;
}

var qQ = setInterval(query, 1000); 

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


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

var loadTimes = {};
var queryTimes = {};
var currentID = 0;

var N = 1000; //1000 Records per INSERT operation.

function randomString (strLength) {
    var result = "";
    charSet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
    while (--strLength) {
            result += charSet[Math.floor(Math.random() * charSet.length)];
    }
    return result;
}



var insert = function(){

	pool.getConnection(function(err, client){

		var insertStatement = "";
		for (var i = 0; i < N; i++){
			currentID ++;
			insertStatement += "("+currentID+",'"+randomString(8)+"','"+randomString(8)+"'),";
		}
		insertStatement = insertStatement.slice(0, -1);
		//Upsert started here.
		var timestamp = process.hrtime();
		loadTimes[currentID+N] = [timestamp[0] + timestamp[1]/(1000000000)]; //record...
		client.query("INSERT INTO TESTTB VALUES "+ insertStatement+";", function(err, rowsInserted){
			if(err){
				console.error("Mismatch in insertion? Insertion Error", err, rowsInserted);
			}
			client.release();
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


// Concurrency Tester : Services65.

var when = require('when');
var pipeline = require("when/pipeline");
 
var config = {
  libpath: '/Users/xtong/Downloads/dbeaver/plugins/snowflake_jdbc.jar',
  drivername: 'com.snowflake.client.jdbc.SnowflakeDriver',
  url: 'jdbc:snowflake://zuora.snowflakecomputing.com:443/?ssl=on&user=xtong&account=zuora&warehouse=ZAN&db=ZAN100&schema=PUBLIC',
  // optionally   
  user: 'xtong',
  password: 'zuora123456',
};
 


// var conString = "postgresql://admin:E5bpbTcp3A8tFdvZ@zan-2.chhc89tply39.us-west-2.redshift.amazonaws.com:5439/xt_1mil";

var out = {};

var pipelineArray = [];
for(threads = 0; threads < 24; threads++){
	pipelineArray.push(function(ceil){
		out[ceil] = out[ceil] || {};
		//fire off CEIL number of requests
		var engageThreads = Array.apply(null, {length: ceil}).map(Number.call, Number);
		return when.all(when.map(engageThreads, function(_v, i){
			console.log("x");
			return when.promise(function(resolve, reject, notify){
				var jdbc = new (require('jdbc'))();
				jdbc.initialize(config, function(err, res) {
				  if (err) {
				    console.log(err);
				  }
				});
				jdbc.open( function(err, conn) {
				  if(err) {
				  	resolve();
				    return console.error('error fetching client from pool', err);
				  }
				  out[ceil][i]=[process.hrtime(), 0];
				  var cache = i;
				  jdbc.executeQuery("/* 100-01 */ select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from rateplancharge, account, subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' Group By account.account_number Order By tcv;", function(err, result) {
				    out[ceil][cache][1] = process.hrtime();
				    jdbc.close(function(){});
				    resolve();
				    if(err) {
				      return console.error('error running query', err);
				    }
				  });
				});
			});
		})).then(function(_){
			return ceil + 1;
		});
	});
}

pipeline(pipelineArray, 1).then(function(xout){
	console.log(xout);
	console.log(JSON.stringify(out));
}).catch(function(xout){
	console.log("ERROR'd out");
	console.log(xout);
	console.log(JSON.stringify(out));
});

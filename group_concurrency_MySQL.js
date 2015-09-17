// Concurrency Tester : Services65.

var mysql = require('mysql');
var when = require('when');
var pipeline = require("when/pipeline");

var out = {};



var queries = ["select with(leaf_pushdown=true) Account.account_number, sum(RatePlanCharge.mrr), sum(RatePlanCharge.tcv) as tcv from RatePlanCharge, \
Account, Subscription where \
RatePlanCharge.account_id=Account.id and RatePlanCharge.subscription_id=Subscription.id and Subscription.version=1 and Subscription.status='Active' \
Group By Account.account_number Order By tcv;",
"select account_number, sum(balance) from Account as account group by account_number;",
"select charge_type, sum(charge_dmrc) from RatePlanCharge group by charge_type;",
"select charge_type, charge_dmrc from RatePlanCharge where effective_start_date='2015-01-18';",
"select charge_type, charge_dmrc from RatePlanCharge where effective_start_date>'2015-01-18';",
"select subscription_start_date, count(id) from Subscription group by subscription_start_date;"];


var pipelineArray = [];
for(threads = 0; threads < queries.length; threads++){
	var config = {
	  host: 'ec2-54-68-167-99.us-west-2.compute.amazonaws.com',
	  user: 'root',
	  password: 'password',
	  database: 'zan_pt11',
	  connectTimeout: 150000,
	  connectionLimit: threads+1
	};
	pipelineArray.push(function(ceil){

		var pool = mysql.createPool(config);

		out[ceil] = out[ceil] || {};
		//fire off CEIL number of requests
		var engageThreads = Array.apply(null, {length: queries.length}).map(Number.call, Number);
		return when.all(when.map(engageThreads, function(_v, i){
			console.log("x");
			return when.promise(function(resolve, reject, notify){
				pool.getConnection(function(err, client) {
				  if(err) {
				    return console.error('error fetching client from pool', err);
				  }
				  out[ceil][i]=[process.hrtime(), 0];
				  var cache = i;
				  client.query(queries[i % queries.length], function(err, result) {
				    //call `done()` to release the client back to the pool
				    out[ceil][cache][1] = process.hrtime();
				    client.release();
				    console.log("OK");
				    resolve();
				    if(err) {
				      return console.error('error running query', err);
				    }
				  });
				});
			});
		})).then(function(_){
			console.log("Done", ceil);
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

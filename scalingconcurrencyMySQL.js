// Concurrency Tester : Services65.

var mysql = require('mysql');
var when = require('when');
var pipeline = require("when/pipeline");
// pg.defaults.poolSize = 100;

var out = {};

var config = {
  host: 'ec2-54-68-167-99.us-west-2.compute.amazonaws.com',
  user: 'root',
  password: 'password',
  database: 'zan_pt8',
  connectTimeout: 60000,
  connectionLimit: 30
};

var pool = mysql.createPool(config);


var pipelineArray = [];
for(threads = 0; threads < 24; threads++){
	pipelineArray.push(function(ceil){
		out[ceil] = out[ceil] || {};
		//fire off CEIL number of requests
		var engageThreads = Array.apply(null, {length: ceil}).map(Number.call, Number);
		return when.all(when.map(engageThreads, function(_v, i){
			console.log("x");
			return when.promise(function(resolve, reject, notify){
				pool.getConnection(function(err, client) {
				  if(err) {
				    return console.error('error fetching client from pool', err);
				  }
				  out[ceil][i]=[process.hrtime(), 0];
				  var cache = i;
				  client.query("select with(leaf_pushdown=true) Account.account_number, sum(RatePlanCharge.mrr), sum(RatePlanCharge.tcv) as tcv from RatePlanCharge, \
Account, Subscription where \
RatePlanCharge.account_id=Account.id and RatePlanCharge.subscription_id=Subscription.id and Subscription.version=1 and Subscription.status='Active' \
Group By Account.account_number Order By tcv;", function(err, result) {
				    //call `done()` to release the client back to the pool
				    out[ceil][cache][1] = process.hrtime();
				    client.release();
				    resolve();
				    if(err) {
				      return console.error('error running query', err);
				    }
				  });
				});
			});
		})).then(function(_){
			console.log("DONE: ", ceil);
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

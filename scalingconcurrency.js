// Concurrency Tester : Services65.

var pg = require('pg');
var when = require('when');
var pipeline = require("when/pipeline");
pg.defaults.poolSize = 100;

var conString = "postgresql://admin:E5bpbTcp3A8tFdvZ@zan-2.chhc89tply39.us-west-2.redshift.amazonaws.com:5439/xt_1mil";

var out = {};

var queries = ["select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=1 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=2 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=3 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=4 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=5 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=6 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=7 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=8 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=9 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=10 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=11 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=12 and  rateplancharge.tenant_id='11' and subscription.tenant_id='11' and account.tenant_id='11' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=1 and  rateplancharge.tenant_id='54' and subscription.tenant_id='54' and account.tenant_id='54' Group By account.account_number Order By tcv;"
,"select account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from mt_RPC rateplancharge, mt_ACC account, mt_SUB subscription where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscription.id and subscription.version=1 and subscription.status='Active' and Extract(Month from subscription.contractdatetime)=2 and  rateplancharge.tenant_id='54' and subscription.tenant_id='54' and account.tenant_id='54' Group By account.account_number Order By tcv;"];

var pipelineArray = [];
for(threads = 0; threads < 24; threads++){
	pipelineArray.push(function(ceil){
		out[ceil] = out[ceil] || {};
		//fire off CEIL number of requests
		var engageThreads = Array.apply(null, {length: ceil}).map(Number.call, Number);
		return when.all(when.map(engageThreads, function(_v, i){
			console.log("x");
			return when.promise(function(resolve, reject, notify){
				pg.connect(conString, function(err, client, done) {
				  if(err) {
				    return console.error('error fetching client from pool', err);
				  }
				  out[ceil][i]=[process.hrtime(), 0];
				  var cache = i;
				  client.query(queries[i % queries.length], function(err, result) {
				    //call `done()` to release the client back to the pool
				    // console.log(result);
				    out[ceil][cache][1] = process.hrtime();
				    done();
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

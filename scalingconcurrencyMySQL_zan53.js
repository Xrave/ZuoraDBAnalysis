// Concurrency Tester : Services65.

var mysql = require('mysql');
var when = require('when');
var pipeline = require("when/pipeline");
// pg.defaults.poolSize = 100;

var out = {};

var config = {
  host: 'ec2-54-68-167-99.us-west-2.compute.amazonaws.com',
  user: 'root',
  password: '',
  database: 'zan_53',
  connectTimeout: 60000,
  connectionLimit: 30
};

var pool = mysql.createPool(config);


var pipelineArray = [];
for(threads = 0; threads < 14; threads++){
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
				  client.query("select billingacc4_.account_number as col_0_0_, \
        SUM(subscripti0_.mrc) as col_1_0_, \
        SUM(subscripti0_.tcv) as col_2_0_ \
    from \
         rateplancharge_for_ds_tb subscripti0_ \
    left outer join \
        rateplan_for_ds_tb subscripti1_  \
            on subscripti0_.subscriptionRatePlan_id=subscripti1_.id \
            and ( \
                subscripti1_.deleted=0 \
                and subscripti1_.tenant_id='53' \
            ) \
    left outer join \
        zb_subscription subscripti2_ \
            on subscripti1_.subscription_id=subscripti2_.id \
            and ( \
                subscripti2_.deleted=0 \
                and subscripti2_.tenant_id='53' \
            ) \
    left outer join \
        zb_subscriptionstatus subscripti3_ \
            on subscripti2_.status_id=subscripti3_.id \
    left outer join \
        	 zb_billing_account billingacc4_ \
            on subscripti2_.customer_id=billingacc4_.id \
            and ( \
                billingacc4_.deleted=0 \
                and billingacc4_.tenant_id='53' \
            ) \
    where \
        subscripti2_.version='1' \
        and subscripti3_.label='Active' \
        /*and subscripti0_.updated_on>=? */ \
        and subscripti0_.deleted=0 \
        and subscripti0_.tenant_id='53' \
    group by \
        billingacc4_.account_number \
    order by \
        SUM(subscripti0_.tcv) asc;", function(err, result) {
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

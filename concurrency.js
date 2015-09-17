// Concurrency Tester : Services65.

var pg = require('pg')
pg.defaults.poolSize = 100;

var conString = "postgresql://admin:E5bpbTcp3A8tFdvZ@zan-2.chhc89tply39.us-west-2.redshift.amazonaws.com:5439/xt_1mil";

var out = new Array(400);
var finished =0;
var started = 0;
for(i=0; i < 400; i++){
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  out[i]=[process.hrtime(), 0];
	  var cache = i;
	  started += 1;
	  client.query("/* 3 */ select TOP 100 account.account_number, sum(rateplancharge.mrr), sum(rateplancharge.tcv) as tcv from rateplancharge, account, subscriptionsorted where rateplancharge.account_id=account.id and rateplancharge.subscription_id=subscriptionsorted.id and subscriptionsorted.version=1 and subscriptionsorted.status='Active'  Group By account.account_number Order By tcv;", function(err, result) {
	    //call `done()` to release the client back to the pool
	    out[cache][1] = process.hrtime();
	    finished +=1;
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	  });
	});
}

setInterval(function(){
	if(finished == 400){
		console.log(out);
	}else{
		console.log("nope", finished);
	}
}, 5000)
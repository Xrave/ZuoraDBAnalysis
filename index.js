var unirest = require("unirest");
var exec = require('child_process').exec;

var user = {
	user: "distribution.demo.10m@zuora.com",
	pass: "123456"
};

var AQuA = "select *, Account.Id, Subscription.Id from RatePlanCharge";

var filepathname = "00RatePlanCharge.csv";

SOME_EXIT_CONDITION = false;

function waitForFinish(data){
	var jid = data.id;
	console.log("~ ");
	unirest.get("https://services65.zuora.com/apps/api/batch-query/jobs/"+jid)
	.header("Authorization", "Basic ZGlzdHJpYnV0aW9uLmRlbW8uMTBtQHp1b3JhLmNvbToxMjM0NTY=")
	.end(function(resp){
		console.log(resp.body.status);
		if(resp.body.status === "completed"){
			finish(resp.batches[0].fileId);
		}else{
			setTimeout(waitForFinish, 1*1000*60, data);
		}
	});
};

var finish = function(fid){
	console.log("cURLing...");
	var child = exec('curl -X GET -H "Authorization: Basic ZGlzdHJpYnV0aW9uLmRlbW8uMTBtQHp1b3JhLmNvbToxMjM0NTY==" -H "Cache-Control: no-cache" -H "Postman-Token: 07847bbc-94d9-6d48-cde3-a79a58d0377c" https://services65.zuora.com/apps/api/file/'+fid+' > ' + filepathname + "; tail -n +2 " + filepathname + " > " + filepathname+".stripped", 
		function(err, stdout, stderr){
		    console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
		    console.log("DONE");
		    SOME_EXIT_CONDITION = true;
		});

};

unirest.post("https://services65.zuora.com/apps/api/batch-query/")
.header("Authorization", "Basic ZGlzdHJpYnV0aW9uLmRlbW8uMTBtQHp1b3JhLmNvbToxMjM0NTY=")
.header("content-type", "application/json")
.send({ 
	"format":"CSV",
	"version":"1.1",
	"partner":"gooddata",
	"project":"aoiwe",
	"encrypted":"none",
	"queries":[ 

	{ 
		"name":"Accounts",
		"query": AQuA,
		"type":"zoqlexport"
	}
	],
	"name":"DSEXPORT"
})
.end(function(resp){
	console.log(resp.body);
	setTimeout(waitForFinish, 3000, resp.body);
});

(function wait () {
   if (!SOME_EXIT_CONDITION) setTimeout(wait, 1000);
})();



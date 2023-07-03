const http = require('http');
const process = require('process');
//import cluster from 'node:cluster';
const trigger_shim_addr = "192.168.1.3"
var fs = require('fs');
var request = require('request');
var action_data_templates = fs.readFileSync("./action_data.json", "utf-8");
const rule_fn = require('./applets/applet_adPwmjqu.json.ts');

function execute_rule(trigger_data, action_data_arr) {
	//const rule_fn = require('./rule.js');
	console.time('test');
	var t = rule_fn(trigger_data, action_data_arr);
	console.timeEnd('test');
	return t;		
}

function format_action_data(trigger_data, action_data_templates) {
	return action_data_templates; 
}

async function send_action_data(i, action_data) {
	//console.log(action_data);
	//TODO: Impl this
	//console.log("sent action data");
	var options = {
		uri: "http://node0.spigot1.cs799-serverless-pg0.wisc.cloudlab.us/action_data_plain/",
                path: '/action_data_plain/',
                port: '80',
                method: 'POST',
                json: true,
                body: {
                        "action_id" : "0",
                        "oauth_token": "5f8eac3ef18e9c3c40a65f1958620ed2d192acd97d0d7f1ffc43b63a9f2bc14a0724c0884b03cd6ed52f68a71581b4dfcc7cafe15f4e334a9baedde47fff5378",
                        "body": JSON.stringify(action_data),
                        "params" : "{\"attrib1\": \"val1\"}"
                }
        };

	request(options, function (error, response, body) {
		//console.log(body)
	})


}

function request_trigger_data(req) {
	var options = {
		uri: "http://192.168.1.3:7777/event_data/",
  		path: '/event_data/',
                port: '7777',
  		method: 'POST',
		json: true,
		body: {
			"trigger_id" : "0",
			"oauth_token": "5f8eac3ef18e9c3c40a65f1958620ed2d192acd97d0d7f1ffc43b63a9f2bc14a0724c0884b03cd6ed52f68a71581b4dfcc7cafe15f4e334a9baedde47fff5378",
			"nonce": "1234",
			"params" : "{\"attrib1\": \"val1\"}"
		}
	};

	var ret = "";
	request(options, function (error, response, body) {
		//console.log(body)
		var trigger_data = JSON.stringify(body.data);
		const action_data_arr = format_action_data(trigger_data, action_data_templates);
        	var ret = execute_rule(trigger_data, action_data_arr);
		console.log(ret);
        	var action_skip_vector = ret[1];
        	for (var i = 0; i < action_skip_vector.length; i++) {
                	if (action_skip_vector[i] === 0) {
                        	send_action_data(i, ret[1][i]);
                	}
        	}

	})

}

function trigger_notif_handler(req, res) {
	//res.writeHead(200);
	//res.end('Trigger Event has been activated');
	//const trigger_data = request_trigger_data(req);
	//const action_data_arr = format_action_data(trigger_data, action_data_templates);
	//var ret = execute_rule(trigger_data, action_data_arr);
	//var action_skip_vector = ret[1];
	//for (var i = 0; i < action_skip_vector.length; i++) {
	//	if (action_skip_vector[i] === 0) {
	//		send_action_data(i, ret[1][i]);
	//	}
	//}
	var options = {
		uri: "http://node1.spigot1.cs799-serverless-pg0.wisc.cloudlab.us/event_data/",
                path: '/event_data/',
                port: '80',
                method: 'POST',
                json: true,
                body: {
                        "trigger_id" : "0",
                        "oauth_token": "5f8eac3ef18e9c3c40a65f1958620ed2d192acd97d0d7f1ffc43b63a9f2bc14a0724c0884b03cd6ed52f68a71581b4dfcc7cafe15f4e334a9baedde47fff5378",
                        "nonce": "1234",
                        "params" : "{\"attrib1\": \"val1\"}"
                }
        };

        var ret = "";
        request(options, function (error, response, body) {
                //console.log(body)
		if (error === null) {
                	var trigger_data = body.data;
			//console.log(trigger_data);
                	const action_data_arr = format_action_data(trigger_data, action_data_templates);
                	var ret = execute_rule(trigger_data, action_data_arr);
			//console.log(ret);
                	var action_skip_vector = ret[1];
                	for (var i = 0; i < action_skip_vector.length; i++) {
                        	if (action_skip_vector[i] === 0) {
                                	send_action_data(i, ret[0][i]);
                        	}
                	}
			res.writeHead(200);
			res.end("success");
		} else {
			console.log(error);
		}
        });

	
}

function isTriggerNotification(req) {
	return req.method === 'POST'
}

const requestListener = function (req, res) {
	//console.log(req)
	if (isTriggerNotification(req)) {
		trigger_notif_handler(req, res);
	} else {
		res.writeHead(500);
		res.end('Not a trigger notification request');
	}
}

const server = http.createServer(requestListener);
console.log("Listening on 80");

const memoryData = process.memoryUsage();

  const memoryUsage = {
                  rss: `${memoryData.rss} -> Resident Set Size - total memory allocated for the process execution`,
                  heapTotal: `${memoryData.heapTotal} -> total size of the allocated heap`,
                  heapUsed: `${memoryData.heapUsed} -> actual memory used during the execution`,
                  external: `${memoryData.external} -> V8 external memory`,
        };

        console.log(memoryUsage);

server.listen(80);

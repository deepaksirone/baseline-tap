const http = require('http');
//import cluster from 'node:cluster';
const trigger_shim_addr = "192.168.1.3"
//import cluster from 'node:cluster';
//import { cpus } from 'node:os';
//import process from 'node:process';
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var fs = require('fs');
var request = require('request');
var action_data_templates = fs.readFileSync("./action_data.json", "utf-8");

function execute_rule(trigger_data, action_data_arr) {
	const rule_fn = require('./rule.js');
	return rule_fn(trigger_data, action_data_arr);		
}

function format_action_data(trigger_data, action_data_templates) {
	return action_data_templates; 
}

function send_action_data(i, action_data) {
        //console.log(action_data);
        //TODO: Impl this
        //console.log("sent action data");
        var options = {
                uri: "http://192.168.1.3:7778/action_data_plain/",
                path: '/action_data_plain/',
                port: '7778',
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
			res.end("Finished sending to action services");
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

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer(requestListener).listen(8080);

  console.log(`Worker ${process.pid} started`);
}

//const server = http.createServer(requestListener);
//console.log("Listening on 8080")
//server.listen(8080);

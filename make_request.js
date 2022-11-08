var request = require('request');
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
                ret = JSON.stringify(body);
		console.log(error)
        })

	console.log(ret);


       

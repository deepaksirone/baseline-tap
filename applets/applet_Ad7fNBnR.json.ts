module.exports = function(trigger_data_json, action_data_arr) {

	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);
	console.log(trigger_data_json)


	var Trigger = JSON.parse(trigger_data_json);
	var User = Trigger.LinkToProfile;
	action_data[0].Twitter.Tweet = "Hey " + User + ", thanks for following me! Have a great day!";



	return [action_data, skip_vector];
}


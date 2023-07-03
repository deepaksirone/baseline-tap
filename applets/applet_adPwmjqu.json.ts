module.exports = function(trigger_data_json, action_data_arr) {

	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);
	console.log(trigger_data_json)

	var date = new Date();
	var time_hour = date.getHours();
	if (time_hour > 5 && time_hour < 19) {
  		skip_vector[0] = 1;
	}


	skip_vector[0] = 0;

	return [action_data, skip_vector];
}


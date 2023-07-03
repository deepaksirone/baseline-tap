
module.exports = function(trigger_data_json, action_data_arr) {
	var date = new Date();
	var currentHour = date.getHours();
	var currentMinute = date.getMinutes();
	var error = "Triggered out of time range.";

	//console.log(currentHour)
	//console.log(currentMinute)
	console.log(trigger_data_json)
	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);

	// Check if the action should be skipped
	if(currentHour == 17 && currentMinute <= 30) {
        	//WemoSwitch.attributeSocketOnDiscrete.skip(error);
		skip_vector[0] = 1;
	} else if(currentHour == 7 && currentMinute >= 30) {
        	//WemoSwitch.attributeSocketOnDiscrete.skip(error);
		skip_vector[0] = 1;
	} else if(currentHour >= 8 && currentHour <= 16) {
        	//WemoSwitch.attributeSocketOnDiscrete.skip(error);
		skip_vector[0] = 1;
	}

	skip_vector[0] = 0;

	return [action_data, skip_vector];
}

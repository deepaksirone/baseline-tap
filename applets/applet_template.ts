module.exports = function(trigger_data_json, action_data_arr) {

	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);


	return [action_data, skip_vector];
}


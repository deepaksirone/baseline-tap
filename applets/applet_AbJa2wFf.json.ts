module.exports = function(trigger_data_json, action_data_arr) {

	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);
	console.log(trigger_data_json)

	var Netro = JSON.parse(trigger_data_json).Moisture;
	if (parseInt(Netro) < 70) {
		  skip_vector[0] = 0;
	}

	skip_vector[1] = 1;
	return [action_data, skip_vector];
}



module.exports = function (trigger_data_json, action_data_arr) {
	
	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);
	//Email.sendMeEmail.skip("Skipping!")
	//skip_vector[0] = 1;
	console.log(trigger_data_json)

	return [action_data, skip_vector];
}

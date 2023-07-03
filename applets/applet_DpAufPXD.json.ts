module.exports = function(trigger_data_json, action_data_arr) {

	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);
	console.log(trigger_data_json)
	var date = new Date();

	var season = date.getMonth();
	// By month:     J   F   M   A   M   J   J   A   S   O   N   D
	var sunrises = [ 9,  8,  7,  7,  6,  5,  5,  6,  7,  8,  8,  9 ];
	var sunsets = [ 15, 16, 17, 19, 20, 21, 21, 20, 19, 18, 16, 15 ];

	var hour = date.getHours();

	// If daylight
	if (hour >= sunrises[season] && hour <= sunsets[season]) {
  		//Hue.turnOnAllHue.skip();
		skip_vector[0] = 1;
	}

	skip_vector[0] = 0;
	return [action_data, skip_vector];
}


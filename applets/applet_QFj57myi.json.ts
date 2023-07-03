

module.exports = function(trigger_data_json, action_data_arr) {
	var skip_vector = [0];
        var action_data = JSON.parse(action_data_arr);
	var GoogleCalendar = JSON.parse(trigger_data_json).GoogleCalendar;
	console.log(trigger_data_json)

	if (GoogleCalendar.anyEventEnds.Title != "Holidays away") {
		//IfNotifications.sendNotification.skip("Not Holidays away")
		skip_vector[0] = 1;
	}
	
	return [action_data, skip_vector];
}

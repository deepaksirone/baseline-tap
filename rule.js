var moment = require('moment');


module.exports = function (trigger_data_json, action_data_arr) {
	//console.log(JSON.parse(trigger_data_json));
	var AndroidPhone = JSON.parse(trigger_data_json).AndroidPhone;
	var skip_vector = [0];
	var action_data = JSON.parse(action_data_arr);

	var s_length = parseInt(AndroidPhone.placeAPhoneCall.CallLength);
	var endTime = moment(moment(AndroidPhone.placeAPhoneCall.OccurredAt, 'MMMM dd, YYYY at hh:mmA').add(moment(AndroidPhone.placeAPhoneCall.CallLength, 'seconds')), 'MMMM dd, YYYY at hh:mmA').toString();
	var min = moment(moment(AndroidPhone.placeAPhoneCall.OccurredAt, 'MMMM dd, YYYY at hh:mmA').add(1,'minutes'), 'MMMM dd, YYYY at hh:mmA').toString();
	if (s_length > 120) {
  		action_data[0].EndTime = endTime;
	} else {
  		action_data[0].EndTime = min;
	}

	return [action_data, skip_vector];
};


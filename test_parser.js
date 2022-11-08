const fs = require('fs');
var trigger_data = fs.readFileSync("./trigger_data.json", "utf-8");
console.log(JSON.parse(trigger_data));
var action_data = fs.readFileSync("./action_data.json", "utf-8");
console.log(JSON.parse(action_data)[0]);

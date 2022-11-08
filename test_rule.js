var rulefn = require('./rule.js');
const fs = require('fs');
var trigger_data = fs.readFileSync("./trigger_data.json", "utf-8");
var action_data = fs.readFileSync("./action_data.json", "utf-8");
          
console.log(rulefn(trigger_data, action_data));

const moment = require('moment');

var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);

var date = moment();
date.add(1, "year").subtract(9, 'month');
console.log(date.format("MMM Do, YYYY"));
console.log(date.format("h:mm a"));

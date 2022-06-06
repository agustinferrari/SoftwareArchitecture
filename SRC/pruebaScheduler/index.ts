const schedule = require('node-schedule');


//runs every 24 date 24 of each month
const rule = new schedule.RecurrenceRule();
rule.date = 23;
rule.hour = 14;
rule.minute = 51;

const recurrentJob = schedule.scheduleJob(rule, function(){
  console.log('The answer to life, the universe, and everything!');
});

const date = new Date(2022, 4, 23, 14, 51, 0);

const jobByDate = schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
});

console.log('afuera.');
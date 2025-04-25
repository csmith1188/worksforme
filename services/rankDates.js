const { date } = require('joi');
const DaySchedule = require('./DaySchedule');
const dayjs = require('dayjs');
const dateFormat = 'YYYY-MM-DD';

// test data

const calendar1 = {
    '2021-06-01': new DaySchedule([[1400, 1420], [960, 970]]),
    '2021-06-02': new DaySchedule([[600, 620], [985, 1020]]),
    '2021-06-03': new DaySchedule([[900, 920], [1000, 1020]]),
    '2021-06-04': new DaySchedule([[720, 740], [840, 860]]),
    '2021-06-05': new DaySchedule([[560, 580], [1020, 1040]]),
};
const calendar2 = {
    '2021-06-01': new DaySchedule([[1080, 1100]]),
    '2021-06-02': new DaySchedule([[700, 720], [900, 920]]),
    '2021-06-03': new DaySchedule([[800, 820], [1100, 1120]]),
    '2021-06-04': new DaySchedule([[600, 620], [1000, 1020]]),
    '2021-06-05': new DaySchedule([[720, 740], [840, 860]]),
    '2021-06-06': new DaySchedule([[560, 580], [1020, 1040]]),
};

function getDateRange(minDateStr, maxDateStr) {
    const start = dayjs(minDateStr);
    const end = dayjs(maxDateStr);
    const dates = [];
  
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      dates.push(current.format(dateFormat));
      current = current.add(1, 'day');
    }
  
    return dates;
  }

// combines multiple user's calendars into one big calendar
function combineCalendars(calendarArray){

    let combinedCalendar = {};

    for(let calendar of calendarArray){
        for(let date of Object.keys(calendar)){
            let schedule = calendar[date];

            if(combinedCalendar.hasOwnProperty(date)){
                combinedCalendar[date].busyTimes = combinedCalendar[date].busyTimes.concat(schedule.busyTimes);
            } else {
                combinedCalendar[date] = schedule;
            }
        }
    }

    return combinedCalendar;
}

//returns map of optimal dates to times
function doIt(calendarArray, startMins, endMins, minDate, maxDate){

    const combinedCalendar = combineCalendars(calendarArray);

    let optimalDatesMap = new Map();

    for(let date of getDateRange(minDate, maxDate)){
        // If the date is not in the combined calendar, it is has no busy times, so the preferred time can be used, else get the closest time
        let optimalTime = combinedCalendar.hasOwnProperty(date) ? combinedCalendar[date].getClosestTime(startMins, endMins) : startMins;

        if(optimalTime !== null){
            optimalDatesMap.set(date, optimalTime);
        }

    }

    const sortedDates = Array.from(optimalDatesMap.entries())
    .sort((a, b) => Math.abs(a[1] - startMins) - Math.abs(b[1] - startMins));
    
    console.log(sortedDates);

    return sortedDates;

}

//console.log(combineCalendars([calendar1, calendar2])['2021-06-01'].getClosestTime(970, 1020));
//console.log(doIt([calendar1, calendar2], 985, 1020, '2021-06-01', '2021-06-06'));


module.exports = doIt;
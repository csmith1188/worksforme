const DaySchedule = require('./DaySchedule');
const formatDate = require('../util/formatDate');



// test data

const calendar1 = {
    '2021-06-01': new DaySchedule([[480, 540], [720, 780], [900, 960]]),
    '2021-06-02': new DaySchedule([[540, 900]]),
    '2021-06-05': new DaySchedule([[450, 540], [630, 750], [960, 1080]]),
    '2021-06-07': new DaySchedule([[510, 600], [720, 840], [990, 1080]]),
    '2021-06-09': new DaySchedule([[555, 630], [810, 870], [1020, 1140]]),
    '2021-06-23': new DaySchedule([[540, 660], [780, 870], [960, 1080]]),
    '2021-06-25': new DaySchedule([[480, 570], [660, 750], [840, 930]]),
};
const calendar2 = {
    '2021-06-01': new DaySchedule([[510, 570], [690, 750], [870, 930]]),
    '2021-06-03': new DaySchedule([[540, 600], [720, 780], [900, 960]]),
    '2021-06-06': new DaySchedule([[450, 510], [630, 690], [960, 1020]]),
    '2021-06-08': new DaySchedule([[510, 570], [720, 780], [990, 1050]]),
    '2021-06-10': new DaySchedule([[555, 615], [810, 870], [1020, 1080]]),
    '2021-06-24': new DaySchedule([[540, 600], [780, 840], [960, 1020]]),
    '2021-06-26': new DaySchedule([[480, 540], [660, 720], [840, 900]]),
};

const calendar3 = {
    '2021-06-02': new DaySchedule([[480, 540], [720, 780], [900, 960]]),
    '2021-06-04': new DaySchedule([[540, 600], [720, 780], [900, 960]]),
    '2021-06-07': new DaySchedule([[450, 510], [630, 690], [960, 1020]]),
    '2021-06-09': new DaySchedule([[510, 570], [720, 780], [990, 1050]]),
    '2021-06-11': new DaySchedule([[555, 615], [810, 870], [1020, 1080]]),
    '2021-06-25': new DaySchedule([[540, 600], [780, 840], [960, 1020]]),
    '2021-06-27': new DaySchedule([[480, 540], [660, 720], [840, 900]]),
};



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

// returns an array of dates sorted by least busy to most busy
function getLeastBusyDates(calendar, startDate, endDate){

    let dateMap = new Map();

    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    // loops through each date from start to end and maps the date to the number of busy times
    while(currentDate <= endDateObj){

        const dateStr = formatDate(currentDate);
        const busyCount = calendar[dateStr] ? calendar[dateStr].busyTimes.length : 0;

        dateMap.set(dateStr, busyCount);

        currentDate.setDate(currentDate.getDate() + 1);

    }

    // sorts the dates by the number of busy times and converts to array
    const sortedDates = [...dateMap].sort((a, b) => (a[1] - b[1]));
    const sortedDatesArray = sortedDates.map(([key, value]) => key);

    return sortedDatesArray;
    
}

//returns map of optimal dates to times
function doIt(calendarArray, startMins, endMins, minDate, maxDate){

    const eventLength = endMins - startMins;
    const combinedCalendar = combineCalendars(calendarArray);
    const leastBusyDates = getLeastBusyDates(combinedCalendar, minDate, maxDate);
    let optimalDatesMap = new Map();

    for(date of leastBusyDates){
        // If the date is not in the combined calendar, it is has no busy times, so the preferred time can be used, else get the closest time
        let optimalTime = combinedCalendar.hasOwnProperty(date) ? combinedCalendar[date].getClosestTime(startMins, eventLength) : startMins;

        if(optimalTime !== null){
            optimalDatesMap.set(date, optimalTime);
        }

    }

    return optimalDatesMap;

}

module.exports = doIt;
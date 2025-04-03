const DaySchedule = require('./DaySchedule');
const formatDate = require('../util/formatDate');



// test data

const calendar1 = {
    '2021-06-01': new DaySchedule([[300,600], [700, 970]]),
};
const calendar2 = {
    '2021-06-01': new DaySchedule([[900, 1100]]),
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

            combinedCalendar[date].busyTimes.sort((a, b) => a[0] - b[0] || a[1] - b[1]);


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

    const combinedCalendar = combineCalendars(calendarArray);
    const leastBusyDates = getLeastBusyDates(combinedCalendar, minDate, maxDate);
    let optimalDatesMap = new Map();

    for(date of leastBusyDates){
        // If the date is not in the combined calendar, it is has no busy times, so the preferred time can be used, else get the closest time
        let optimalTime = combinedCalendar.hasOwnProperty(date) ? combinedCalendar[date].getClosestTime(startMins, endMins) : startMins;

        if(optimalTime !== null){
            optimalDatesMap.set(date, optimalTime);
        }

    }

    // Sort the optimalDatesMap by time closest to startMins
    optimalDatesMap = new Map([...optimalDatesMap.entries()].sort((a, b) => {
        const timeA = Math.abs(a[1] - startMins);
        const timeB = Math.abs(b[1] - startMins);
        return timeA - timeB;
    }));

    console.log(optimalDatesMap);

    return optimalDatesMap;

}


module.exports = doIt;
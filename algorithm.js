
// represents a user's schedule in a day

class DaySchedule {
    constructor(busyTimes) {
        this.busyTimes = busyTimes;
        this.minutesBuffer = 30;
    }

    addBusyTime(startTime, endTime) {
        this.busyTimes.push([startTime, endTime]);
    }

    isBusy(targetTimeInt){

        let conflict = this.busyTimes.some(busyTime => {
            let busyStartInt = timeStringToMinutes(busyTime[0]);
            let busyEndInt = timeStringToMinutes(busyTime[1]);
            return targetTimeInt >= busyStartInt - this.minutesBuffer + 1 && targetTimeInt <= busyEndInt + this.minutesBuffer - 1;
        });

        return conflict;
    }
}

// helper functions

function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTimeString(minutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const remainingMinutes = String(minutes % 60).padStart(2, '0');
    return `${hours}:${remainingMinutes}`;
}

const calendar1 = {
    '2021-06-01': new DaySchedule([['08:00', '09:00'], ['12:00', '13:00'], ['15:00', '16:00']]),
    '2021-06-02': new DaySchedule([['09:00', '15:00']]),
    '2021-06-05': new DaySchedule([['07:30', '09:00'], ['10:30', '12:30'], ['16:00', '18:00']]),
    '2021-06-07': new DaySchedule([['08:30', '10:00'], ['12:00', '14:00'], ['16:30', '18:00']]),
    '2021-06-09': new DaySchedule([['09:15', '10:30'], ['13:30', '14:30'], ['17:00', '19:00']]),
    '2021-06-23': new DaySchedule([['09:00', '11:00'], ['13:00', '14:30'], ['16:00', '18:00']]),
    '2021-06-25': new DaySchedule([['08:00', '09:30'], ['11:00', '12:30'], ['14:00', '15:30']]),
};

const calendar2 = {
    '2021-06-01': new DaySchedule([['05:00', '11:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-02': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-04': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '18:00']]),
    '2021-06-05': new DaySchedule([['08:00', '10:00'], ['12:00', '13:30'], ['14:30', '16:00']]),
    '2021-06-06': new DaySchedule([['06:30', '08:30'], ['12:00', '13:30'], ['14:00', '15:30']]),
    '2021-06-07': new DaySchedule([['07:30', '09:00'], ['10:30', '12:00'], ['14:00', '15:00']]),
    '2021-06-08': new DaySchedule([['08:30', '10:00'], ['12:00', '13:00'], ['14:30', '16:00']]),
    '2021-06-09': new DaySchedule([['06:30', '08:30'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-10': new DaySchedule([['09:30', '11:00'], ['13:00', '14:30'], ['16:30', '18:00']]),
    '2021-06-11': new DaySchedule([['07:30', '09:00'], ['11:30', '13:00'], ['15:30', '17:00']]),
    '2021-06-12': new DaySchedule([['08:00', '09:00'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-13': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-14': new DaySchedule([['05:00', '11:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-15': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-16': new DaySchedule([['07:00', '08:30'], ['09:30', '11:00'], ['13:30', '15:00']]),
    '2021-06-17': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '18:00']]),
    '2021-06-18': new DaySchedule([['08:00', '10:00'], ['12:00', '13:30'], ['14:30', '16:00']]),
    '2021-06-19': new DaySchedule([['06:30', '08:30'], ['12:00', '13:30'], ['14:00', '15:30']]),
    '2021-06-20': new DaySchedule([['07:30', '09:00'], ['10:30', '12:00'], ['14:00', '15:00']]),
    '2021-06-21': new DaySchedule([['08:30', '10:00'], ['12:00', '13:00'], ['14:30', '16:00']]),
    '2021-06-22': new DaySchedule([['06:30', '08:30'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-23': new DaySchedule([['09:30', '11:00'], ['13:00', '14:30'], ['16:30', '18:00']]),
    '2021-06-24': new DaySchedule([['07:30', '09:00'], ['11:30', '13:00'], ['15:30', '17:00']]),
    '2021-06-25': new DaySchedule([['08:00', '09:00'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-26': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-27': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-28': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-29': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-30': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-31': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-07-01': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
};

const calendar3 = {
    '2021-06-01': new DaySchedule([['06:30', '08:30'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-08': new DaySchedule([['09:30', '11:00'], ['13:00', '14:30'], ['16:30', '18:00']]),
    '2021-06-10': new DaySchedule([['07:30', '09:00'], ['11:30', '13:00'], ['15:30', '17:00']]),
    '2021-06-11': new DaySchedule([['08:00', '09:00'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-12': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-14': new DaySchedule([['08:00', '09:30'], ['10:30', '12:00'], ['13:30', '15:00']]),
    '2021-06-16': new DaySchedule([['07:00', '09:00'], ['11:00', '12:30'], ['13:30', '15:00']]),
    '2021-06-18': new DaySchedule([['08:00', '09:30'], ['12:00', '13:30'], ['14:30', '16:00']]),
    '2021-06-19': new DaySchedule([['09:00', '11:00'], ['12:30', '14:00'], ['16:00', '17:30']]),
    '2021-06-21': new DaySchedule([['08:30', '09:30'], ['11:00', '12:30'], ['13:00', '14:30']]),
    '2021-06-23': new DaySchedule([['10:30', '12:00'], ['14:00', '15:00'], ['16:30', '17:30']]),
    '2021-06-24': new DaySchedule([['09:00', '11:00'], ['12:30', '14:00'], ['16:00', '17:30']]),
};

const calendar4 = {
    '2021-06-02': new DaySchedule([['08:00', '09:30'], ['11:00', '12:30'], ['14:00', '15:00']]),
    '2021-06-04': new DaySchedule([['09:00', '10:00'], ['13:00', '14:30'], ['15:30', '17:00']]),
    '2021-06-06': new DaySchedule([['08:30', '09:30'], ['10:30', '12:00'], ['13:00', '14:30']]),
    '2021-06-08': new DaySchedule([['09:00', '10:00'], ['11:30', '13:00'], ['14:30', '16:00']]),
    '2021-06-10': new DaySchedule([['07:30', '09:00'], ['11:00', '12:30'], ['14:00', '15:30']]),
    '2021-06-12': new DaySchedule([['09:30', '11:00'], ['13:00', '14:30'], ['16:00', '17:30']]),
    '2021-06-13': new DaySchedule([]),
    '2021-06-15': new DaySchedule([['07:30', '09:00'], ['10:30', '12:00'], ['13:00', '14:30']]),
    '2021-06-24': new DaySchedule([['07:00', '08:30'], ['09:30', '11:00'], ['13:00', '14:30']]),
};

const calendar5 = {
    '2021-06-01': new DaySchedule([['06:00', '07:30'], ['09:00', '10:30'], ['12:30', '14:00']]),
    '2021-06-02': new DaySchedule([['08:00', '09:30'], ['11:00', '12:30'], ['14:00', '15:00']]),
    '2021-06-04': new DaySchedule([['07:00', '08:30'], ['09:30', '11:00'], ['14:00', '15:30']]),
    '2021-06-06': new DaySchedule([['09:00', '10:30'], ['12:00', '13:30'], ['15:00', '16:30']]),
    '2021-06-16': new DaySchedule([['09:00', '10:30'], ['12:00', '13:30'], ['14:30', '16:00']]),
    '2021-06-18': new DaySchedule([]),
    '2021-06-20': new DaySchedule([['08:00', '09:00'], ['11:30', '13:00'], ['14:30', '16:00']]),
    '2021-06-22': new DaySchedule([['10:00', '11:30'], ['13:00', '14:30'], ['15:00', '16:30']]),
    '2021-06-24': new DaySchedule([['08:30', '10:00'], ['12:00', '13:30'], ['15:00', '16:30']]),
    '2021-06-26': new DaySchedule([['09:00', '10:30'], ['11:30', '13:00'], ['14:00', '15:30']]),
};

// combines multiple user's calendars into one
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

function getLeastBusyDates(calendar, startDate, endDate, limit = -1){

    let dateMap = new Map();

    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while(currentDate <= endDateObj){

        const dateStr = formatDate(currentDate);
        const busyCount = calendar[dateStr] ? calendar[dateStr].busyTimes.length : 0;

        dateMap.set(dateStr, busyCount);

        currentDate.setDate(currentDate.getDate() + 1);

    }

    const sortedDates = [...dateMap].sort((a, b) => (a[1] - b[1]));
    let sortedDatesArray = sortedDates.map(([key, value]) => key);

    if(limit !== -1){
        sortedDatesArray = sortedDates.splice(0,limit);
    }

    return sortedDatesArray;
}

function getOptimalTime(daySchedule, preferredTime = '12:00', timeRange = [0, 60*24]){

    const preferredMinutes = timeStringToMinutes(preferredTime);

    let closestTime = null;
    let closestDifference = Infinity;

    for(let minutes = timeRange[0]; minutes < timeRange[1]; minutes++){
        if(!daySchedule.isBusy(minutes)){

            const difference = Math.abs(preferredMinutes - minutes);

            if (difference < closestDifference) {
                closestTime = minutes;
                closestDifference = difference;
            }
        }
    }

    return minutesToTimeString(closestTime);
    
}


let start = Date.now();

const preferredTime = '15:00';


const combined = combineCalendars([calendar1, calendar2, calendar3, calendar4, calendar5]);
const leastBusyDates = getLeastBusyDates(combined, '2021-06-01', '2021-07-01');

let finalMap = new Map();

for(date of leastBusyDates){
    if(combined.hasOwnProperty(date)){
        finalMap.set(date, getOptimalTime(combined[date], preferredTime));
    } else {
        finalMap.set(date, preferredTime)
    }
}

console.log(finalMap);

console.log(Date.now() - start);
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
            let busyTimeInt = timeStringToMinutes(busyTime);
            return targetTimeInt >= busyTimeInt + this.minutesBuffer && targetTimeInt <= busyTimeInt - this.minutesBuffer;
        });

        return conflict;
    }
}

const calendar1 = {
    '2021-06-01': new DaySchedule([['08:00', '09:00'], ['12:00', '13:00'], ['15:00', '16:00']]),
    '2021-06-02': new DaySchedule([['08:00', '09:00'], ['12:00', '13:00'], ['15:00', '16:00']]),
    '2021-06-03': new DaySchedule([['08:00', '09:00'], ['12:00', '13:00'], ['15:00', '16:00']]),
    '2021-06-04': new DaySchedule([['08:00', '09:00'], ['12:00', '13:00'], ['15:00', '16:00']]),
    '2021-06-05': new DaySchedule([['08:00', '09:00'], ['12:00', '13:00'], ['15:00', '16:00']]),
};

const calendar2 = {
    '2021-06-06': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-07': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-08': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-09': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
    '2021-06-10': new DaySchedule([['09:00', '10:00'], ['13:00', '14:00'], ['16:00', '17:00']]),
};


//we have enums at home
const MORNING = 0;
const NOON = 1;
const AFTERNOON = 2;

function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes}`;
}

function combineCalendars(calendarArray){
    let combinedCalendar = {};
    for(let calendar of calendarArray){
        for(let date in calendar){
            let schedule = calendar[date];

            if(!schedule.hasOwnProperty(date)){
                combinedCalendar[date] = schedule;
                continue;
            }

            combinedCalendar[date].busyTimes = combinedCalendar[date].busyTimes.concat(calendar[date].busyTimes);
        }
    }
    return combinedCalendar;
}

// gets the optimal time of a day schedule
function getOptimalTime(daySchedule, timeRange = [0, 60*24]){

    for(let minutes = timeRange[0]; minutes < timeRange[1]; minutes++){
        if(!daySchedule.isBusy(minutes)){
            return minutesToTimeString(minutes);
        }
    }
    
}

function getOptimalDateTime(calendarArray, timeRange = [0, 60*24]){

    const combinedCalendar = combineCalendars(calendarArray);

    for(let date in combinedCalendar){
        const optimalTime = getOptimalTime(combinedCalendar[date], timeRange);
        if(optimalTime){
            return [date, optimalTime];
        }
    }

}

console.log(getOptimalDateTime([calendar1, calendar2]));
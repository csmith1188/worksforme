const timeBuffer = 30;

class DaySchedule {
    constructor(busyTimes) {
        this.busyTimes = busyTimes;
    }

    isTimeBefore(time1, time2) {
        const date1 = new Date(`1970-01-01T${time1}:00Z`);  // Use a dummy date for comparison
        const date2 = new Date(`1970-01-01T${time2}:00Z`);
        
        return date1 < date2;
    }
    
    isTimeAfter(time1, time2) {
        const date1 = new Date(`1970-01-01T${time1}:00Z`);
        const date2 = new Date(`1970-01-01T${time2}:00Z`);
        
        return date1 > date2;
    }

    addBusyTime(startTime, endTime) {
        this.busyTimes.push([startTime, endTime]);
    }

    isBusy(targetTime){
        let conflict = this.busyTimes.find(busyTime => this.isTimeBefore(busyTime[0], targetTime - timeBuffer) && this.isTimeAfter(busyTime[1], targetTime + timeBuffer));
        if(conflict) {
            return true;
        } else {
            return false;
        }
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

function range(size) {
    return [...Array(size).keys()];
}

function getOptimalDates(calendarArray, targetMonth) {
    let optimalDates = [];
    for (let cal of calendarArray) {
        let dates = Object.keys(cal);
        for (let date of dates) {
            let day = cal[date]; 
            
        }
    }

    console.log(optimalDates);
}

getOptimalDates([calendar1, calendar2]);
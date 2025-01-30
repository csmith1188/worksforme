const { timeStringToMinutes, minutesToTimeString } = require('../util/timeHelper');

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
            let busyStart = busyTime[0];
            let busyEnd = busyTime[1];
            return targetTimeInt >= busyStart - this.minutesBuffer + 1 && targetTimeInt <= busyEnd + this.minutesBuffer - 1;
        });

        return conflict;
    }

    getClosestTime(preferredMinutes){
    
        let closestTime = null;
        let closestDifference = Infinity;
    
        for(let minutes = 0; minutes < 60*24; minutes++){
            if(!this.isBusy(minutes)){
    
                const difference = Math.abs(preferredMinutes - minutes);
    
                if (difference < closestDifference) {
                    closestTime = minutes;
                    closestDifference = difference;
                }
            }
        }
    
        return closestTime;
        
    }

}

module.exports = DaySchedule;
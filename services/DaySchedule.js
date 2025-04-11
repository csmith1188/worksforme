const { timeStringToMinutes, minutesToTimeString } = require('../util/timeHelper');

class DaySchedule {

    constructor(busyTimes) {
        this.busyTimes = busyTimes;
        this.minutesBuffer = 15;
    }

    isBusy(targetTimeInt) {

        let conflict = this.busyTimes.some(busyTime => {
            let busyStart = busyTime[0];
            let busyEnd = busyTime[1];
            return targetTimeInt >= busyStart - this.minutesBuffer + 1 && targetTimeInt <= busyEnd + this.minutesBuffer - 1;
        });

        return conflict;
    }

    sortBusyTimes(){
        this.busyTimes.sort((a, b) => a[0] - b[0]);
    }

    getClosestTime(startMins, endMins) {

        const eventLength = endMins - startMins;
        if (eventLength <= 0) return null;
        
        let lastEnd = 0;

        this.sortBusyTimes();
        
        for (let i = 0; i <= this.busyTimes.length; i++) {
            const nextBusyStart = i < this.busyTimes.length ? this.busyTimes[i][0] : 1440;
            const gapStart = lastEnd + this.minutesBuffer;
            const gapEnd = nextBusyStart - this.minutesBuffer;
            const gapLength = gapEnd - gapStart;
        
            if (gapLength >= eventLength) {
                // If desired start fits in this gap, return it
                if (startMins >= gapStart && startMins + eventLength <= gapEnd) {
                    return startMins;
                }
            
                // Otherwise, return earliest possible start in the gap
                if (gapStart + eventLength <= gapEnd) {
                    return gapStart;
                }
            }
        
            // Move lastEnd forward for the next loop
            if (i < this.busyTimes.length) {
                lastEnd = Math.max(lastEnd, this.busyTimes[i][1]);
            }
        }
        
        return null; // No valid slot found
    }
          
    
}

module.exports = DaySchedule;
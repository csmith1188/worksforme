const { timeStringToMinutes, minutesToTimeString } = require('../util/timeHelper');

class DaySchedule {

    constructor(busyTimes) {
        this.busyTimes = busyTimes;
        this.minutesBuffer = 15;
    }

    addBusyTime(startTime, endTime) {
        this.busyTimes.push([startTime, endTime]);
    }

    isBusy(targetTimeInt) {

        let conflict = this.busyTimes.some(busyTime => {
            let busyStart = busyTime[0];
            let busyEnd = busyTime[1];
            return targetTimeInt >= busyStart - this.minutesBuffer + 1 && targetTimeInt <= busyEnd + this.minutesBuffer - 1;
        });

        return conflict;
    }

    getClosestTime(startMins, endMins) {

        let eventLength = endMins - startMins;
        let closestTime = null;
        let closestDifference = Infinity;

        for (let i = 0; i < this.busyTimes.length - 1; i++) {
            let endOfCurrentBusy = this.busyTimes[i][1];
            let startOfNextBusy = this.busyTimes[i + 1][0];

            // return null if there is less than the event length minutes in between two busy times
            if(Math.abs(startOfNextBusy - endOfCurrentBusy) < eventLength + this.minutesBuffer){
                return null;
            }

            let middlePoint = (endOfCurrentBusy + startOfNextBusy) / 2;

            if (!this.isBusy(middlePoint)) {
                const difference = Math.abs(startMins - middlePoint);

                if (difference < closestDifference) {
                    closestTime = Math.round(middlePoint);
                    closestDifference = difference;
                }
            }
        }

        return closestTime;
    }
}

module.exports = DaySchedule;
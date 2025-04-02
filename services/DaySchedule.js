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

    /*getClosestTime(startMins, endMins) {

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
    }*/

    getClosestTime(startMins, endMins) {
        const eventLength = endMins - startMins;
        let closestTime = null;
        let closestDifference = Infinity;

        // If there are no busy times, return the start of the event as the closest time
        if (this.busyTimes.length === 0) {
            return startMins;
        }

        // Check if the event can be scheduled before the first busy period (if startMins is before the first busy time)
        let firstBusyStart = this.busyTimes[0][0];
        if (startMins + eventLength <= firstBusyStart) {
            let availableStart = startMins;
            if (!this.isBusy(availableStart)) {
                closestTime = availableStart;
                closestDifference = Math.abs(startMins - availableStart);
            }
        }

        // Check if the event can be scheduled after the last busy period (if endMins is after the last busy time)
        let lastBusyEnd = this.busyTimes[this.busyTimes.length - 1][1];
        if (endMins >= lastBusyEnd) {
            let availableStart = lastBusyEnd;
            if (!this.isBusy(availableStart)) {
                const difference = Math.abs(startMins - availableStart);
                if (difference < closestDifference) {
                    closestTime = availableStart;
                    closestDifference = difference;
                }
            }
        }

        // Check for available time between busy periods, ensuring that the event fits within the preferred time range
        for (let i = 0; i < this.busyTimes.length - 1; i++) {
            let endOfCurrentBusy = this.busyTimes[i][1];
            let startOfNextBusy = this.busyTimes[i + 1][0];

            // If there is enough room between two busy times for the event to fit
            if (Math.abs(startOfNextBusy - endOfCurrentBusy) >= eventLength + this.minutesBuffer) {
                let middlePoint = (endOfCurrentBusy + startOfNextBusy) / 2;

                // Ensure that the middle point is within the preferred time range
                if (middlePoint >= startMins && middlePoint + eventLength <= endMins && !this.isBusy(middlePoint)) {
                    const difference = Math.abs(startMins - middlePoint);

                    if (difference < closestDifference) {
                        closestTime = Math.round(middlePoint);
                        closestDifference = difference;
                    }
                }
            }
        }

        // Return the closest time found, or null if no available time was found
        return closestTime;
    }
}

module.exports = DaySchedule;
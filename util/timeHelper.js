function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTimeString(minutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const remainingMinutes = String(minutes % 60).padStart(2, '0');
    return `${hours}:${remainingMinutes}`;
}

module.exports = { 
    timeStringToMinutes, 
    minutesToTimeString 
};
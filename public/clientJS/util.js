function minutesToTimeString(mins){
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function timeStringToMinutes(timeString){
    return timeString.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
}
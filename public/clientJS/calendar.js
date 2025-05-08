const pxPer15Mins = 10;
const dateFormat = 'YYYY-MM-DD';

const timeBlockInnerHTML = `
    <p class="time-block-text"></p>
    <div class="time-block-resize-point"></div>
    <div class="time-block-move-point"></div>
`;

// the amount that must be scrolled before we consider it a scroll event
const scrollThreshold = 10; // pixels
const doubleTapDelay = 200; // milliseconds

let userCalendar;

let isLeftMouseDown = false;
let isRightMouseDown = false;
let draggingElement = null;

let newBlock = null;
let resizingBlock = null;
let movingBlock = null;

let movingBlockMouseOffset = null;

let targetColumn = null;

let weekOf;
let dayHeaders;
let dateSelect;
let prevWeekButton;
let nextWeekButton;
let saveButton;

let grid;
let gridBox;
let gridBottom;
let gridStyle;
let dayColumns;

let selectedDate = dayjs();

let editList = {
    createdBlocks: new Set(),
    editedBlocks: new Set(),
    deletedBlockUIDs: new Set(),
};

let importedBlocks = new Set(); // blocks imported from google calendar

// associates timeblock elements with their data
let timeBlockMap = new Map();

let unsavedChanges = false;

let lastTap = 0;

let scrolled = false;

function snapNum(num, snapTo) {
    return Math.round(num / snapTo) * snapTo;
}

document.addEventListener('DOMContentLoaded', function() {

    weekOf = document.getElementById('week-of');
    dayHeaders = Array.from(document.getElementsByClassName('day-header'));
    dateSelect = document.getElementById('date-select');
    prevWeekButton = document.getElementById('prev-week-btn');
    nextWeekButton = document.getElementById('next-week-btn');
    saveButton = document.getElementById('save-btn');
    importGoogleButton = document.getElementById('import-google-btn');

    // no go back in time
    dateSelect.min = dayjs().format(dateFormat);

    grid = document.getElementById('grid');
    gridBox = grid.getBoundingClientRect();
    gridBottom = grid.scrollHeight;
    gridStyle = getComputedStyle(grid);
    dayColumns = Array.from(document.getElementsByClassName('day-column'));

    loadCalendarFromDB();

    dateSelect.addEventListener('change', function() {
        clearGrid();
        setWeek(dayjs(dateSelect.value));
    });

    prevWeekButton.addEventListener('click', function() {

        let newWeek = dayjs(selectedDate).subtract(1, 'week');
        // no go back in time
        if (newWeek.startOf('week').isBefore(dayjs().startOf('week'))) return;
        saveWeek(selectedDate);
        clearGrid();
        setWeek(newWeek);
    });

    nextWeekButton.addEventListener('click', function() {
        saveWeek(selectedDate);
        clearGrid();
        setWeek(selectedDate.add(1, 'week'));
    });

    saveButton.addEventListener('click', function() {
        saveChangesToDB();
    });

    importGoogleButton.addEventListener('click', function() {
        importGoogleCalendar();
    });

    grid.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    window.addEventListener('beforeunload', function(event) {
        if (unsavedChanges) {
            const message = "You have unsaved changes. Are you sure you want to leave?";
            event.returnValue = message; // Some browsers require this
            return message; // Other browsers might require this
        }
    });

    grid.addEventListener('mousedown', onPointerDown);
    grid.addEventListener('touchstart', onPointerDown);

    grid.addEventListener('mouseup', onPointerUp);
    grid.addEventListener('touchend', onPointerUp);

    grid.addEventListener('mousemove', onPointerMove);
    grid.addEventListener('touchmove', onPointerMove);
    
});

function onPointerDown(e){

    const isTouch = e.type === 'touchstart';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    // save the current scroll position so we can use it to check if the user scrolled
    //lastScrollTop = grid.scrollTop;

    if (e.button === 0) {
        isLeftMouseDown = true; 
    } else if (e.button === 2) {
        isRightMouseDown = true;
    }

    if (e.button === 2) return;

    // if you clicked on a cell (you are placing a new block)
    if (e.target.classList.contains('inner-cell')) {

        targetColumn = e.target.parentElement.parentElement;

        newBlock = createTimeBlock(null, true);

        // only able to resize while creating on desktop, since you need to be able to scroll on mobile
        if (!isTouch) resizingBlock = newBlock;

        let yDiff = clientY - targetColumn.getBoundingClientRect().top;
        // round to the nearest 15 minutes
        let blockY = snapNum(yDiff, pxPer15Mins);

        newBlock.style.top = blockY + 'px';

    // if you clicked on a resize point (you want to resize the block)
    } else if (e.target.classList.contains('time-block-resize-point')) {

        const block = e.target.parentElement;
        resizingBlock = block;

    // move point
    // you get the idea
    } else if(e.target.classList.contains('time-block-move-point')) {

        const block = e.target.parentElement;
        movingBlock = block;

    }

}

function onPointerUp(e){
    console.log('ye')

    const isTouch = e.type === 'touchend';

    if (e.button === 0) {
        isLeftMouseDown = false;
    } else if (e.button === 2) {
        isRightMouseDown = false;
    }

    let wasDoubleTap = false;

    // check for double tap
    if(isTouch){
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < doubleTapDelay && tapLength > 0) {
            wasDoubleTap = true;
            e.preventDefault(); //prevent zoom on double tap
        }

        lastTap = currentTime;
    }

    // right click or double tap to delete timeblock
    if ((e.button === 2 || wasDoubleTap) && e.target.parentElement.classList.contains('time-block')) {
        const block = e.target.parentElement;
        deleteTimeBlock(block, true);
        return;
    }

    // if the user is scrolling, don't do anything
    if (newBlock && !scrolled) {
        // add the block to the cell
        if(!newBlock.parentElement){
            addTimeBlockToDayColumn(targetColumn.dataset.index, newBlock);
        }

        updateTimeBlock(newBlock, false)

        // finished creating block
        newBlock = null;
        resizingBlock = null;
        targetColumn = null;

    } else if (resizingBlock) {

        // finished resizing
        resizingBlock = null;
    } else if (movingBlock){
        // finished moving
        movingBlock = null;
        movingBlockMouseOffset = null;
    }

    scrolled = false;

}

function onPointerMove(e){

    const isTouch = e.type === 'touchmove';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    if (isTouch){
        let yDiff = clientY - gridBox.top;
        // set the scroll flag if the user is scrolling
        if (yDiff > scrollThreshold) scrolled = true; 
    }

    if (isRightMouseDown && e.target.parentElement.classList.contains('time-block')) {
        const block = e.target.parentElement;
        deleteTimeBlock(block, true);
        return;
    }

    if (newBlock){
        // if the block hasn't been added to the cell, add it
        // don't do this on mobile, since you need to be able to scroll
        if(!newBlock.parentElement && !isTouch){
            addTimeBlockToDayColumn(targetColumn.dataset.index, newBlock);
        }

    }
    
    if (resizingBlock) {

        // prevent default to avoid scrolling while resizing
        if (isTouch) e.preventDefault();

        const blockBox = resizingBlock.getBoundingClientRect();
        const blockTop = parseInt(resizingBlock.style.top);
        const blockBottom = parseInt(resizingBlock.style.top) + parseInt(resizingBlock.style.height);
        const currentBlockHeight = parseInt(resizingBlock.style.height);

        let yDiff = clientY - blockBox.top;
        let newHeight = snapNum(yDiff, pxPer15Mins);

        // clamp
        if (newHeight < pxPer15Mins) newHeight = pxPer15Mins;

        // if there's no difference, don't do anything
        if (newHeight === currentBlockHeight) return;

        const maxHeight = gridBottom - blockTop;
        if (newHeight > maxHeight) newHeight = maxHeight;

        resizingBlock.style.height = newHeight + 'px';

        // if the block is still being created, don't add log the update
        updateTimeBlock(resizingBlock, !Boolean(newBlock));

    // moving block
    } else if (movingBlock) {

        // prevent default to avoid scrolling while moving
        if (isTouch) e.preventDefault();

        const column = movingBlock.parentElement.parentElement;

        const blockBox = movingBlock.getBoundingClientRect();
        const columnBox = column.getBoundingClientRect();
        const currentBlockTop = parseInt(movingBlock.style.top);
        const hoveringElement = document.elementFromPoint(clientX, clientY);

        let yDiff = clientY - columnBox.top;

        // handle moving block to another column
        // if the mouse is not on the block
        if (hoveringElement.parentElement !== movingBlock && clientY > blockBox.top && clientY < blockBox.bottom) {
            // -1 if mouse is left of the block center, 1 if mouse is right of the block center
            let direction = Math.sign(clientX - (blockBox.left + blockBox.width / 2));
            
            const newColumn = dayColumns[dayColumns.indexOf(column) + direction];

            if(newColumn){
                addTimeBlockToDayColumn(newColumn.dataset.index, movingBlock);
                updateTimeBlock(movingBlock, true);
            }

        }

        if(movingBlockMouseOffset === null){
            movingBlockMouseOffset = clientY - blockBox.top;
        }

        let newY = snapNum(yDiff - movingBlockMouseOffset, pxPer15Mins);

        // clamp
        if(newY < 0) newY = 0;
        if(newY + blockBox.height > columnBox.height) newY = gridBottom - blockBox.height;

        // if there's no difference, don't do anything
        if (newY === currentBlockTop) return;

        movingBlock.style.top = newY + 'px';

        updateTimeBlock(movingBlock, true);

    }

}

function initCalendar(){
    setWeek(selectedDate);
}

function clearGrid(){
    dayColumns.forEach(dayColumn => {
        dayColumn.querySelector('.time-blocks').innerHTML = '';
    });
}

function loadCalendarFromDB(){
    fetch('/calendar/get-calendar-data', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            // Process the data and update the calendar
            userCalendar = new Map(Object.entries(data));
            clearGrid();
            initCalendar(userCalendar);
        })
        .catch(error => alert('Failed to load calendar'));
}

function importGoogleCalendar(){
    fetch('/calendar/import-google-calendar', { method: 'POST' })
        .then(response => response.json())
        .then(data => {

            // remove all previously imported blocks
            userCalendar.forEach((blocks, date) => {
                userCalendar.set(date, blocks.filter(block => !block.googleID));
                if (userCalendar.get(date).length === 0) {
                    userCalendar.delete(date);
                }
            });

            let googleCalendar = new Map();

            data.forEach(event => {

                let date;
                let start;
                let end;

                // if event is all day event
                if (event.start.date) {
                    
                    date = dayjs(event.start.date).format(dateFormat);
                    start = 0;
                    end = 24 * 60; // 24 hours in minutes

                // normal ahh event
                } else {

                    date = dayjs(event.start.dateTime).format(dateFormat);
                    start = dayjs(event.start.dateTime).hour() * 60 + dayjs(event.start.dateTime).minute();
                    end = dayjs(event.end.dateTime).hour() * 60 + dayjs(event.end.dateTime).minute();
            
                }

                let blockData = {
                    date: date,
                    start: start,
                    end: end,
                    uid: null,
                    googleID: event.id,
                }

                if (!googleCalendar.has(date)) {
                    googleCalendar.set(date, []);
                }

                googleCalendar.get(date).push(blockData);
                editList.createdBlocks.add(blockData);
                importedBlocks.add(blockData);
                unsavedChanges = true;

            });

            // merge the existing calendar with the google calendar
            userCalendar = new Map([...userCalendar, ...googleCalendar]);

            clearGrid();
            initCalendar(userCalendar);
            
        })
        .catch(error => alert("Failed to load Google calendar"));
}

// saves changes to database
function saveChangesToDB(){

    if (!unsavedChanges) return;

    fetch('/calendar/save-calendar-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            createdBlocks: Array.from(editList.createdBlocks),
            editedBlocks: Array.from(editList.editedBlocks),
            deletedBlockUIDs: Array.from(editList.deletedBlockUIDs),
        })
    })
    .then(response => {
        if (response.ok) {
            // clear the edit list and reset unsaved changes flag
            editList.createdBlocks.clear();
            editList.editedBlocks.clear();
            editList.deletedBlockUIDs.clear();
            unsavedChanges = false;
            // must reload the calendar from the database to get the new uids
            loadCalendarFromDB();

            alert('Changes saved');
        } else {
            alert('Internal Server Error');
        }
    })
    .catch(error => {
        alert('Error saving changes');
    });

}

// converts timeblocks to calendar data and saves to userCalendar. 
// THIS DOES NOT SAVE TO DATABASE. THIS IS JUST FOR SAVING THE STATE OF THE BLOCKS LOCALLY.
function saveWeek(date){

    const startOfWeek = dayjs(date).startOf('week');
    let weekData = [];

    dayColumns.forEach((dayColumn, index) => {
        
        let date = startOfWeek.add(index, 'day').format(dateFormat);
        let dayBusyTimes = getDayBusyTimes(dayColumn);

        if (userCalendar.has(date) && dayBusyTimes.length === 0) {
            userCalendar.delete(date);
            return;
        }

        weekData[index] = dayBusyTimes;

    });

    weekData.forEach((busyTimes, dayIndex) => {
        userCalendar.set(startOfWeek.add(dayIndex, 'day').format(dateFormat), busyTimes);
    });

}

// converts calendar to timeblocks and populates grid with them
function loadWeek(date, calendarMap){

    const startOfWeek = dayjs(date).startOf('week');
    let weekData = [];

    for (let i = 0; i < 7; i++){

        const day = startOfWeek.add(i, 'day').format(dateFormat);
        weekData[i] = calendarMap.has(day) ? calendarMap.get(day) : null;

    }

    weekData.forEach((timeBlocks, dayIndex) => {
        
        if (timeBlocks === null) return;

        timeBlocks.forEach(timeBlockData => {

            let newBlock = createTimeBlock(timeBlockData.uid, false);

            const startPx = Math.floor(timeBlockData.start / 15) * pxPer15Mins;
            const endPx = Math.floor(timeBlockData.end / 15) * pxPer15Mins;

            newBlock.style.top = startPx + 'px';
            newBlock.style.height = (endPx - startPx) + 'px';

            addTimeBlockToDayColumn(dayIndex, newBlock);

        })

    });
}

// sets the UI for the week and loads week data
function setWeek(date){

    selectedDate = dayjs(date);

    let startOfWeek = selectedDate.startOf('week');

    weekOf.innerText = startOfWeek.format('MMMM D, YYYY');

    for (let i = 0; i < 7; i++) {
        // I love dayjs so much
        dayHeaders[i].querySelector('.date-text').innerText = startOfWeek.add(i, 'day').format('D');
    }

    //clearGrid();
    loadWeek(date, userCalendar);

}

// calculates the times of a timeblock
function getTimeBlockTime(timeBlock){
    const blockStyle = getComputedStyle(timeBlock);

    let blockTop = parseInt(blockStyle.top);
    let blockBottom = blockTop + parseInt(blockStyle.height);

    let startMinutes = (blockTop / pxPer15Mins * 15);
    let endMinutes = (blockBottom / pxPer15Mins * 15);
    let startHour = Math.floor(startMinutes / 60);
    let endHour = Math.floor(endMinutes / 60);
    let startMinutesPadded = String(Math.ceil(startMinutes % 60)).padStart(2, '0');
    let endMinutesPadded = String(Math.ceil(endMinutes % 60)).padStart(2, '0');

    // normie time
    let startPeriod = startHour >= 12 && startHour < 24 ? 'PM' : 'AM';
    let endPeriod = endHour >= 12 && endHour < 24 ? 'PM' : 'AM';
    let startHour12 = startHour % 12 || 12;
    let endHour12 = endHour % 12 || 12;

    let startTimeString = `${startHour12}:${startMinutesPadded} ${startPeriod}`;
    let endTimeString = `${endHour12}:${endMinutesPadded} ${endPeriod}`;

    return {
        startMinutes,
        endMinutes,
        startHour,
        endHour,
        startMinutesPadded,
        endMinutesPadded,
        startTimeString,
        endTimeString
    }

}

// converts blocks in a day column to busy time data
function getDayBusyTimes(dayColumn){
    let busyTimes = [];

    let timeBlocks = Array.from(dayColumn.getElementsByClassName('time-block'));

    timeBlocks.forEach(timeBlock => {
        let blockTime = getTimeBlockTime(timeBlock);

        busyTimes.push({
            start: blockTime.startMinutes,
            end: blockTime.endMinutes
        });
    });

    return busyTimes;
}

//adds timeblock to day column

function addTimeBlockToDayColumn(dayIndex, timeBlock){

    dayColumns[dayIndex].querySelector('.time-blocks').appendChild(timeBlock);

    const timeBlockStyle = getComputedStyle(timeBlock);
    const blockTop = parseInt(timeBlockStyle.top);
    const blockBottom = blockTop + parseInt(timeBlockStyle.height);
    const blockHeight = parseInt(timeBlockStyle.height);

    // clamp
    if (blockTop < 0) timeBlock.style.top = '0px';
    if (blockBottom > gridBottom) timeBlock.style.top = (gridBottom - blockHeight) + 'px';

    // update the timeblock date
    const newDate = selectedDate.startOf('week').add(dayIndex, 'day').format(dateFormat);
    let timeBlockData = timeBlockMap.get(timeBlock);
    timeBlockData.date = newDate;

    updateTimeBlock(timeBlock, false);
}

function updateTimeBlockText(timeBlock) {
    const timeBlockTime = getTimeBlockTime(timeBlock);
    timeBlock.querySelector('.time-block-text').innerText = `${timeBlockTime.startTimeString} - ${timeBlockTime.endTimeString}`;
}

function createTimeBlock(uid = null, log = false, imported = false){

    let newBlock = document.createElement('div');
    newBlock.classList.add('time-block');
    newBlock.innerHTML = timeBlockInnerHTML;

    let newBlockData = {
        uid: uid,
        date: null,
        start: null,
        end: null,
        imported: imported
    };

    timeBlockMap.set(newBlock, newBlockData);

    if (log) {
        editList.createdBlocks.add(newBlockData);
        unsavedChanges = true;
    }

    return newBlock;
}

// called when the user edits a timeblock
function updateTimeBlock(timeBlock, log = false){

    const timeBlockTime = getTimeBlockTime(timeBlock);
    updateTimeBlockText(timeBlock);

    let timeBlockData = timeBlockMap.get(timeBlock);
    timeBlockData.start = timeBlockTime.startMinutes;
    timeBlockData.end = timeBlockTime.endMinutes;

    if (!log) return;

    // only log if the block is from the database
    if (timeBlockData.uid !== null){
        editList.editedBlocks.add(timeBlockData);
    }

    unsavedChanges = true;
    
}

function deleteTimeBlock(timeBlock, log = false){

    const timeBlockData = timeBlockMap.get(timeBlock);

    if (!log) return

    // only add the timeblock to deleted list if it has a uid, meaning it came from the database
    if (timeBlockData.uid !== null){
        editList.deletedBlockUIDs.add(timeBlockData.uid);
    }

    // delete all instances
    editList.createdBlocks.delete(timeBlockData);
    editList.editedBlocks.delete(timeBlockData);

    unsavedChanges = true;

    timeBlockMap.delete(timeBlock);
    timeBlock.remove();
}
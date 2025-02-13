const timeGridCols = 12;
const timeGridRows = 24;
const timeGridMinutesDivider = 5;

const daysOfTheWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const dateFormat = "ddd MMM DD YYYY";

let timeGrid;
let timeCells;

let fillStartTime;
let fillEndTime;
let fillBtn;

let fillAllBtn;
let clearAllBtn;

let dateHeader;
let backButton;

let timeGridEdited = false;

document.addEventListener('DOMContentLoaded', function() {

    timeGrid = document.getElementById('timegrid');
    timeCells = Array.from(document.getElementsByClassName('time-cell'));

    fillStartTime = document.getElementById('fill-start-time');
    fillEndTime = document.getElementById('fill-end-time');
    fillBtn = document.getElementById('fill-btn');

    fillAllBtn = document.getElementById('fill-all-btn');
    clearAllBtn = document.getElementById('clear-all-btn');

    dateHeader = document.getElementById('date-header');
    backButton = document.getElementById('back-btn');

    initTimeGrid();
    initFillTools();
});

function setTimeGrid(day, busyTimes, isTemplate){

    timeGridEdited = false;
    selectedDay = day;

    dateHeader.innerText = (isTemplate) ? `${daysOfTheWeek[day]} Template` : dayjs(day).format(dateFormat);

    initializeCells(busyTimes);
}

function getCellID(cellElement){
    return +cellElement.id.split('-')[2];
}

function fillCell(cellID, value, isUser = false){
    document.getElementById('time-cell-' + cellID).checked = value;
    if (isUser) timeGridEdited = true;
}

function fillAllCells(value, isUser){
    timeCells.forEach((cell, index) => {
        fillCell(index, value, isUser);
    })
};

function fillSelectedCells(startCellID, endCellID, value, isUser){
    for(let cellNum = startCellID; cellNum <= endCellID; cellNum++){
        fillCell(cellNum, value, isUser);
    }
}

function initFillTools(){

    fillBtn.addEventListener('click', (e) => {
        // gets the hours and minutes as integers
        const [startHours, startMinutes] = [+fillStartTime.value.split(':')[0], +fillStartTime.value.split(':')[1]];
        const [endHours, endMinutes] = [+fillEndTime.value.split(':')[0], +fillEndTime.value.split(':')[1]];
        // calculates the target cell numbers based on the times
        const startCell = (startHours * timeGridCols) + Math.ceil(startMinutes / timeGridMinutesDivider);
        const endCell = (endHours * timeGridCols) + Math.ceil(endMinutes / timeGridMinutesDivider);

        fillSelectedCells(startCell, endCell, true, true);
    });

    fillAllBtn.addEventListener('click', (e) => {fillAllCells(true, true)});
    clearAllBtn.addEventListener('click', (e) => {fillAllCells(false, true)});
}

function initTimeGrid(){

    let isLeftMouseDown = false;
    let isRightMouseDown = false;

    let lastEditedCell = null;

    timeGrid.addEventListener('contextmenu', (e) => {
        e.preventDefault();  // This prevents the right click menu from appearing
    });

    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isLeftMouseDown = true; 
        } else if (e.button === 2) {
            isRightMouseDown = true;
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isLeftMouseDown = false;
        } else if (e.button === 2) {
            isRightMouseDown = false;
        }
    });

    timeCells.forEach(cell => {

        // new cell behavior (left click to check, right click to uncheck)
        cell.addEventListener('mouseup', (e) => {
            const cellID = getCellID(e.target);

            if (isLeftMouseDown) {
                // hacky but necessary
                setTimeout(() => {
                    fillCell(cellID, true, true);
                }, 10);
            } else if (isRightMouseDown) {
                fillCell(cellID, false, true);
            }

            lastEditedCell = e.target;
        });
    
      
        cell.addEventListener('mousemove', (e) => {
            const cellID = getCellID(e.target);
            // prevents editing the cell you just edited
            if(e.target === lastEditedCell){
                return;
            }

            if(isLeftMouseDown){
                fillCell(cellID, true, true);
                lastEditedCell = e.target;
            } else if(isRightMouseDown){
                fillCell(cellID, false, true);
                lastEditedCell = e.target;
            }

        });
    });

    backButton.addEventListener('click',  () => {
        exitTimeGridPage(selectedDay, getBusyTimes(), timeGridEdited);
    });
}

// takes busy times and sets the cells based on that.
function initializeCells(busyTimes){

    fillAllCells(false, false);

    for(i in busyTimes){
        let busyTime = busyTimes[i];
        let startCellID = Math.floor(busyTime[0] / timeGridMinutesDivider);
        let endCellID = Math.floor(busyTime[1] / timeGridMinutesDivider);

        for(let cellID = startCellID; cellID < endCellID; cellID++){
            fillCell(cellID, true, false);
        }

    }
}

// takes timegrid cells and returns array of busy time pairs.
function getBusyTimes(){
    let busyTimes = [];

    let startCellID = null;

    for (let cellID in timeCells) {
        let cell = timeCells[cellID];
        // start of a busy time
        if (cell.checked && !startCellID) {
            startCellID = cellID;
        // end of a busy time
        } else if (!cell.checked && startCellID) {

            let startTime = startCellID * timeGridMinutesDivider;
            let endTime = cellID * timeGridMinutesDivider;

            busyTimes.push([startTime, endTime]);
            startCellID = null;
        }

    }

    // accounts for edge case where the last cell is filled
     if(startCellID && timeCells[timeCells.length - 1].checked){
        let startTime = startCellID * timeGridMinutesDivider;
        let endTime = timeCells.length * timeGridMinutesDivider;
         busyTimes.push([startTime, endTime]);
     }

    return busyTimes;
}
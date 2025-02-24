// the .25 accounts for the border of the cell
// biggest brain blast of my entire life
const pxPer15Mins = 10;

const timeBlockInnerHTML = `
    <p class="time-block-text"></p>
    <div class="time-block-resize-point"></div>
    <div class="time-block-move-point"></div>
`;

let isMouseDown = false;
let draggingElement = null;

let newBlock = null;
let resizingBlock = null;
let movingBlock = null;

let movingBlockMouseOffset = null;

let targetColumn = null;

let grid;
let gridBox;
let gridStyle;
let dayColumns;

function snapNum(num, snapTo) {
    return Math.round(num / snapTo) * snapTo;
}

document.addEventListener('DOMContentLoaded', function() {
    grid = document.getElementById('grid');
    gridBox = grid.getBoundingClientRect();
    gridStyle = getComputedStyle(grid);
    dayColumns = Array.from(document.getElementsByClassName('day-column'));

    grid.addEventListener('mousedown', function(e) {
        isMouseDown = true;

        // if you clicked on a cell (you are placing a new block)
        if (e.target.classList.contains('inner-cell')) {

            targetColumn = e.target.parentElement.parentElement;

            newBlock = document.createElement('div');
            newBlock.classList.add('time-block');
            newBlock.innerHTML = timeBlockInnerHTML;

            let yDiff = e.clientY - targetColumn.getBoundingClientRect().top;
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

    });

    document.addEventListener('mouseup', function(e) {
        isMouseDown = false;

        if (newBlock) {
            // add the block to the cell
            if(!newBlock.parentElement){
                targetColumn.appendChild(newBlock);
            }

            updateTimeBlock(newBlock);

            // finished creating block
            newBlock = null;
            targetColumn = null;

        } else if (resizingBlock) {
            // finished resizing
            resizingBlock = null;
        } else if (movingBlock){
            // finished moving
            movingBlock = null;
            movingBlockMouseOffset = null;
        }
    });

    document.addEventListener('mousemove', function(e) {
        // resizing block while it's being created
        if(newBlock){
            // if the block hasn't been added to the cell, add it
            if(!newBlock.parentElement){
                targetColumn.appendChild(newBlock);
            }

            let yDiff = e.clientY - newBlock.getBoundingClientRect().top;
            // round to the nearest 15 minutes
            let height = snapNum(yDiff, pxPer15Mins);

            if (height < pxPer15Mins) height = pxPer15Mins;

            newBlock.style.height = height + 'px';

            updateTimeBlock(newBlock);
        
        // resizing an already existing block
        } else if (resizingBlock) {

            console.log('its resizing');

            let blockBox = resizingBlock.getBoundingClientRect();
            let yDiff = e.clientY - blockBox.top;
            // round to the nearest 15 minutes
            let height = snapNum(yDiff, pxPer15Mins);

            if (height < pxPer15Mins) height = pxPer15Mins;

            resizingBlock.style.height = height + 'px';

            updateTimeBlock(resizingBlock);

        // moving block
        } else if (movingBlock) {

            const blockBox = movingBlock.getBoundingClientRect();
            const columnBox = movingBlock.parentElement.getBoundingClientRect();

            let yDiff = e.clientY - columnBox.top;

            if(movingBlockMouseOffset === null){
                movingBlockMouseOffset = e.clientY - blockBox.top;
            }

            let newY = snapNum(yDiff - movingBlockMouseOffset, pxPer15Mins);

            movingBlock.style.top = newY + 'px';

            updateTimeBlock(movingBlock);

        }

    });
    
});

function updateTimeBlock(timeBlock){

    const blockBox = timeBlock.getBoundingClientRect();

    // clamp it

    console.log(parseInt(timeBlock.style.top) + parseInt(timeBlock.style.height));
    console.log(grid.scrollHeight);

    if (parseInt(timeBlock.style.top) < 0) {
        timeBlock.style.top = 0;
    }

    if (parseInt(timeBlock.style.top) + parseInt(timeBlock.style.height) > grid.scrollHeight) {
        console.log('yes');
        //timeBlock.style.top = grid.scrollHeight - blockBox.height + 'px';
    }

    let timeBlockStyle = getComputedStyle(timeBlock);

    let blockTop = parseInt(timeBlockStyle.top);
    let blockBottom = blockTop + parseInt(timeBlockStyle.height);

    let startMinutes = (blockTop / pxPer15Mins * 15);
    let endMinutes = (blockBottom / pxPer15Mins * 15);
    let startHour = Math.floor(startMinutes / 60);
    let endHour = Math.floor(endMinutes / 60);
    let startMinutesPadded = String(Math.ceil(startMinutes % 60)).padStart(2, '0');
    let endMinutesPadded = String(Math.ceil(endMinutes % 60)).padStart(2, '0');
    let startTimeString = `${startHour}:${startMinutesPadded}`;
    let endTimeString = `${endHour}:${endMinutesPadded}`;

    timeBlock.querySelector('.time-block-text').innerText = `${startTimeString} - ${endTimeString}`;
}
// the .25 accounts for the border of the cell
// biggest brain blast of my entire life
const pxPer15Mins = 10;

const horizontalBlockMovingThreshold = 10;

const timeBlockInnerHTML = `
    <p class="time-block-text"></p>
    <div class="time-block-resize-point"></div>
    <div class="time-block-move-point"></div>
`;

let isLeftMouseDown = false;
let isRightMouseDown = false;
let draggingElement = null;

let newBlock = null;
let resizingBlock = null;
let movingBlock = null;

let movingBlockMouseOffset = null;

let targetColumn = null;

let grid;
let gridBox;
let gridBottom;
let gridStyle;
let dayColumns;

function snapNum(num, snapTo) {
    return Math.round(num / snapTo) * snapTo;
}

document.addEventListener('DOMContentLoaded', function() {
    grid = document.getElementById('grid');
    gridBox = grid.getBoundingClientRect();
    gridBottom = grid.scrollHeight;
    gridStyle = getComputedStyle(grid);
    dayColumns = Array.from(document.getElementsByClassName('day-column'));

    grid.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    grid.addEventListener('mousedown', function(e) {
        if (e.button === 0) {
            isLeftMouseDown = true; 
        } else if (e.button === 2) {
            isRightMouseDown = true;
        }

        // right click to delete timeblock
        if (e.button === 2) return;

        // if you clicked on a cell (you are placing a new block)
        if (e.target.classList.contains('inner-cell')) {

            targetColumn = e.target.parentElement.parentElement;

            newBlock = document.createElement('div');
            newBlock.classList.add('time-block');
            newBlock.innerHTML = timeBlockInnerHTML;

            resizingBlock = newBlock;

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
        if (e.button === 0) {
            isLeftMouseDown = false;
        } else if (e.button === 2) {
            isRightMouseDown = false;
        }

        // right click to delete timeblock
        if(e.button === 2 && e.target.parentElement.classList.contains('time-block')) {
            const block = e.target.parentElement;
            block.remove();
            return;
        }

        if (newBlock) {
            // add the block to the cell
            if(!newBlock.parentElement){
                targetColumn.appendChild(newBlock);
            }

            updateTimeBlock(newBlock);

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
    });

    document.addEventListener('mousemove', function(e) {

        if (isRightMouseDown && e.target.parentElement.classList.contains('time-block')) {
            const block = e.target.parentElement;
            block.remove();
            return;
        }

        if (newBlock){
            // if the block hasn't been added to the cell, add it
            if(!newBlock.parentElement){
                targetColumn.appendChild(newBlock);
            }

        }
        
        if (resizingBlock) {

            const blockBox = resizingBlock.getBoundingClientRect();
            const blockTop = parseInt(resizingBlock.style.top);
            const blockBottom = parseInt(resizingBlock.style.top) + parseInt(resizingBlock.style.height);

            let yDiff = e.clientY - blockBox.top;
            let newHeight = yDiff;

            if (newHeight < pxPer15Mins) newHeight = pxPer15Mins;

            // if the new height is bigger than the old height and the block is at the bottom of the grid, don't resize
            if (newHeight > blockBox.height && blockBottom >= gridBottom) {
                newHeight = gridBottom - blockTop;
            }

            resizingBlock.style.height = snapNum(newHeight, pxPer15Mins) + 'px';

            updateTimeBlock(resizingBlock);

        // moving block
        } else if (movingBlock) {

            const column = movingBlock.parentElement;

            const blockBox = movingBlock.getBoundingClientRect();
            const columnBox = column.getBoundingClientRect();

            let yDiff = e.clientY - columnBox.top;

            // if the mouse is not on the block
            if (e.target.parentElement !== movingBlock && e.clientY > blockBox.top && e.clientY < blockBox.bottom) {
                // -1 if mouse is left of the block, 1 if mouse is right of the block
                let direction = Math.sign(e.clientX - (blockBox.left + blockBox.width / 2));
                
                const newColumn = dayColumns[dayColumns.indexOf(column) + direction];
                if(newColumn){
                    newColumn.appendChild(movingBlock);
                }

            }

            if(movingBlockMouseOffset === null){
                movingBlockMouseOffset = e.clientY - blockBox.top;
            }

            let newY = snapNum(yDiff - movingBlockMouseOffset, pxPer15Mins);

            // clamp
            if(newY < 0) newY = 0;
            if(newY + blockBox.height > columnBox.height) newY = gridBottom - blockBox.height;

            movingBlock.style.top = newY + 'px';

            updateTimeBlock(movingBlock);

        }

    });
    
});

function updateTimeBlock(timeBlock){

    const blockStyle = getComputedStyle(timeBlock);

    let blockTop = parseInt(blockStyle.top);
    let blockBottom = blockTop + parseInt(blockStyle.height);

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
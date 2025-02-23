// the .25 accounts for the border of the cell
// biggest brain blast of my entire life
const pxPer15Mins = 10.25;

let isMouseDown = false;
let draggingElement = null;

let newBlock = null;
let resizingBlock = null;
let movingBlock = null;

let movingBlockOriginalY = null;
let movingBlockMouseOffsetY = null;

let targetCell = null;

let grid;
let dayColumns;

function snapNum(num, snapTo) {
    return Math.round(num / snapTo) * snapTo;
}

document.addEventListener('DOMContentLoaded', function() {
    grid = document.getElementById('grid');
    dayColumns = Array.from(document.getElementsByClassName('day-column'));

    grid.addEventListener('mousedown', function(e) {
        isMouseDown = true;

        // if you clicked on a cell (you are placing a new block)
        if (e.target.classList.contains('inner-cell')) {

            targetCell = e.target.parentElement;
            newBlock = document.createElement('div');
            newBlock.classList.add('time-block');

            let cellBox = targetCell.getBoundingClientRect();
            let yDiff = e.clientY - cellBox.top;
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
            // add the block to the cell if the user releases the mouse
            if(!newBlock.parentElement){
                targetCell.appendChild(newBlock);
            }

            // create point on the timeblock where you can click and drag to resize it
            let resizePoint = document.createElement('div');
            resizePoint.classList.add('time-block-resize-point');
            newBlock.appendChild(resizePoint);

            // create point on the timeblock where you can click and drag to move it
            let movePoint = document.createElement('div');
            movePoint.classList.add('time-block-move-point');
            newBlock.appendChild(movePoint);

            // finished creating block
            newBlock = null;
            targetCell = null;

        } else if (resizingBlock) {
            // finished resizing
            resizingBlock = null;
        } else if (movingBlock){
            // finished moving
            movingBlock = null;
            movingBlockOriginalY = null;
        }
    });

    document.addEventListener('mousemove', function(e) {
        // resizing block while it's being created
        if(newBlock){
            // if the block hasn't been added to the cell, add it
            if(!newBlock.parentElement){
                targetCell.appendChild(newBlock);
            }

            let cellBox = targetCell.getBoundingClientRect();
            let yDiff = e.clientY - cellBox.top;
            // round to the nearest 15 minutes
            let height = snapNum(yDiff, pxPer15Mins);

            if (height < pxPer15Mins) height = pxPer15Mins;

            newBlock.style.height = height + 'px';
        
        // resizing an already existing block
        } else if (resizingBlock) {

            let blockBox = resizingBlock.getBoundingClientRect();
            let yDiff = e.clientY - blockBox.top;
            // round to the nearest 15 minutes
            let height = snapNum(yDiff, pxPer15Mins);

            if (height < pxPer15Mins) height = pxPer15Mins;

            resizingBlock.style.height = height + 'px';

        // moving block
        } else if (movingBlock) {

            const blockBox = movingBlock.getBoundingClientRect();
            const cellBox = movingBlock.parentElement.getBoundingClientRect();

            // a little awkward but it ok
            if(movingBlockOriginalY === null){
                movingBlockOriginalY = blockBox.top;
            }

            let yDiff = e.clientY - movingBlockOriginalY;
            let newY = snapNum(yDiff, pxPer15Mins);

            // if the block is moved an hour or more, reparent it to new cell and reset the y offset
            if(Math.abs(newY - parseInt(movingBlock.style.top)) >= pxPer15Mins * 4){

                const dayColumn = movingBlock.parentElement.parentElement;
                const dayCells = Array.from(dayColumn.children);
                const currentCell = movingBlock.parentElement;

                // calculate the current hour the block is in, then find the cell for that hour
                const currentHour = +currentCell.dataset.hour + Math.floor(((newY / pxPer15Mins) * 15) / 60);
                let newParentCell = dayCells.find(cell => +cell.dataset.hour === currentHour);

                // reparent the cell and reset the y offset
                if (newParentCell) {

                    newParentCell.append(movingBlock);
                    movingBlock.style.top = '0px';
                    movingBlockOriginalY = null;

                }

            } else {
                movingBlock.style.top = newY + 'px';
            }

        }

    });
    
});
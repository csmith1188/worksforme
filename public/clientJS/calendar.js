// the .25 accounts for the border of the cell
// biggest brain blast of my entire life
const pxPer15Mins = 10.25;

let isMouseDown = false;
let draggingElement = null;
let newBlock = null;
let targetCell = null;

let grid;

function snapNum(num, snapTo) {
    return Math.floor(num / snapTo) * snapTo;
}

document.addEventListener('DOMContentLoaded', function() {
    grid = document.getElementById('grid');

    document.addEventListener('mousedown', function(e) {
        isMouseDown = true;

        if (e.target.classList.contains('inner-cell')) {
            targetCell = e.target.parentElement;
            newBlock = document.createElement('div');
            newBlock.classList.add('time-block');

            let cellBox = targetCell.getBoundingClientRect();
            // diff between mouseY and the cellY
            let yDiff = e.clientY - cellBox.top;
            // round to the nearest 15 minutes
            let blockY = snapNum(yDiff, pxPer15Mins);

            newBlock.style.top = blockY + 'px';

        }


    });

    document.addEventListener('mouseup', function(e) {
        isMouseDown = false;

        if (newBlock) {
            // add the block to the cell if the user releases the mouse
            if(!newBlock.parentElement){
                targetCell.appendChild(newBlock);
            }

            newBlock = null;
            targetCell = null;

        }
    });

    document.addEventListener('mousemove', function(e) {

        if(newBlock){
            // if the block hasn't been added to the cell, add it
            if(!newBlock.parentElement){
                targetCell.appendChild(newBlock);
            }

            let cellBox = targetCell.getBoundingClientRect();

            // diff between mouseY and the cellY
            let yDiff = e.clientY - cellBox.top;
            // round to the nearest 15 minutes
            let height = snapNum(yDiff, pxPer15Mins);

            if(height < 0){
                let blockY = parseInt(cellBox.y);
                newBlock.style.top = (blockY + height) + 'px';
                newBlock.style.height = Math.abs(height) + 'px';
            } else {
                newBlock.style.height = height + 'px';
            }

        }

    });
    
});
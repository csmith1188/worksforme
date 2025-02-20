const pxPer15Mins = 10;

let isMouseDown = false;
let draggingBlock = null;

let grid;

document.addEventListener('DOMContentLoaded', function() {
    grid = document.getElementById('grid');

    document.addEventListener('mousedown', function(event) {
        isMouseDown = true;
    
        if (event.target.classList.contains('time-block')) {
            draggingBlock = event.target;
        }
    });
    
    document.addEventListener('mouseup', function(event) {
        isMouseDown = false;
        if (draggingBlock) {
            draggingBlock = null;
        }
    });
    
    document.addEventListener('mousemove', function(event) {
        if (draggingBlock) {
            let rect = draggingBlock.getBoundingClientRect();
            let x = (event.clientX - rect.width / 2) - parseInt(grid.style.left);
            let y = (event.clientY - rect.height / 2) - parseInt(grid.style.top);
    
            draggingBlock.style.left = x + 'px';
            draggingBlock.style.top = y + 'px';
        }
    });
});
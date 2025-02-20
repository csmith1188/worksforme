const pxPer15Mins = 10;

let isMouseDown = false;
let draggingElement = null;

let grid;

document.addEventListener('DOMContentLoaded', function() {
    grid = document.getElementById('grid');

    grid.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        draggingElement = e.target;
    });

    grid.addEventListener('mouseup', function(e) {
        isMouseDown = false;
        draggingElement = null;
    });

    grid.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;

        const target = e.target;

        if(target.classList.contains('cell')){
            
        } else if(target.classList.contains('time-block')){

        }

    });
    
});
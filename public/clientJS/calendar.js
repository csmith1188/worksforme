document.addEventListener('DOMContentLoaded', function() {
    // Set things to other things to manipulate them
    const monthYear = document.getElementById('month-year');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    //literly today
    let currentDate = new Date();
    const today = new Date();

    // code that does stuff
    function dayCellClicked(event){
        const cell = event.target;
        const selectedCell = document.getElementsByClassName('selected-day')[0];

        if(selectedCell){
            selectedCell.classList.remove('selected-day');
        }

        cell.classList.add('selected-day');
    }

    // This function is so skibby
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        // This sets the month and year in the calendar header
        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        // This is obv I dont think you need a comment here
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // For every empty cell before the first day of the month, create an empty cell
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            calendarGrid.appendChild(emptyCell);
        }

        // For every day in the month, create a cell with the day number
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;
            dayCell.addEventListener('click', dayCellClicked);
            calendarGrid.appendChild(dayCell);
        }

        // No going back in time for you
        // Yet...
        prevMonthButton.disabled = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
    }

    // Event listeners for the previous and next month buttons
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});

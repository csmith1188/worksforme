document.addEventListener('DOMContentLoaded', function() {
    // Set things to other things to manipulate them
    const monthYear = document.getElementById('month-year');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const weekDayCells = Array.from(document.getElementsByClassName('week-day'));

    const timeGridPageContainer = document.getElementById('timegrid-page-container');
    const calendarPageContainer = document.getElementById('calendar-page-container');

    const backButton = document.getElementById('back-btn');

    //literly today
    let currentDate = new Date();
    const today = new Date();

    function goToTimeGridPage(day){
        timeGridPageContainer.style.display = 'block';
        calendarPageContainer.style.display = 'none';
        setTimeGridDay(day);
    }

    function goToCalendarPage(){
        timeGridPageContainer.style.display = 'none';
        calendarPageContainer.style.display = 'block';
    }

    function dayCellClicked(event){
        const cell = event.target;
        let day = null;


        if(cell.classList.contains('day')){
            // get date in yyyy-mm-dd format
            day = cell.id;
        } else if(cell.classList.contains('week-day')){
            // get day of week index
            day = +cell.id.split('-')[2];
        }

        console.log(day);

        if(day !== null){
            goToTimeGridPage(day);
        }
        
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

        weekDayCells.forEach((weekDay, index) => {
            weekDay.addEventListener('click', dayCellClicked);
        });

        // For every day in the month, create a cell with the day number
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;
            dayCell.id = `${year}-${month + 1}-${day}`;
            dayCell.addEventListener('click', dayCellClicked);
            calendarGrid.appendChild(dayCell);
        }

        // No going back in time for you
        // Yet...
        prevMonthButton.disabled = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
    }

    
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    backButton.addEventListener('click',  () => {
        goToCalendarPage();
    });

    renderCalendar();
});
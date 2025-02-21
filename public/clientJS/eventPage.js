document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/user/inbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // To-do
        // Get event name by its uid
        // Get event description by its uid
        // Get event creator by its uid

    } catch (error) {
        // Alert the user if there was an error in the fetch request
        alert('Error inviting user');
    }

    //popup window for deleting events
    //shows a popup to confirm your decision to delete an event
    const deleteEventButton = document.getElementById('deleteEvent');
    const buttonHTML = `<center><button id="checkMark" class="check-mark">✔</button><button id="xMark" class="x-mark">✖</button></center>`;

    deleteEventButton.addEventListener('click', (event) => {
        event.preventDefault();

        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
        <div class="popup-content">
            <span class="close">&times;</span>
            <h2>Confirmation</h2>
            <p>Are you sure you want to delete this event?</p>
            <div class="notif_buttons">
            ${buttonHTML}
            </div>
        </div>
        `;

        // Add event listener to close the pop-up when the close button is clicked
        const closeBtn = popup.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        // Add event listener to close the pop-up when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        });

        

        document.body.appendChild(popup);
    });
});
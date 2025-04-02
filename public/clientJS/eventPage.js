const addMemberPopup = {
    html: `<input type="text" id="username" placeholder="Enter username or email">
            <input type="hidden" id="eventUID" value="${eventdata.uid}">
            <br><br>
            <button id="invite_button">Invite User</button>
            `,
    title: 'Invite User'
};

const editEventPopup = {
    html: (eventUID) => `
        <form method="POST" action="/event/eventPage/${eventUID}" class="eventForm">
            <h3>Update Event</h3>
            <input type="text" id="newEventName" name="newEventName" placeholder="New Event Name">
            <input id="newEventDesc" name="newEventDesc" placeholder="New Event Description"></input>
            <input type="hidden" name="eventUID" value="${eventUID}">
            <button type="submit" class="btn">Update Event</button>
            <button type="submit" name="deleteEvent" value="true" class="btn btn-delete">Delete Event</button>
        </form>`,
    title: 'Event Settings'
};

document.addEventListener('DOMContentLoaded', () => {
    // Get the elements we need from the page
    const inviteButton = document.getElementById('invite-button');
    const settingsButton = document.getElementById('edit-button');
    const popupContainer = document.getElementById('popup-container');
    const popupContent = document.getElementById('popup-content');
    const popupTitle = document.getElementById('popup-title');
    const closeBtn = document.getElementById('popup-close-btn');

    const calculateDateBtn = document.getElementById('calculate-date-btn');

    if (!inviteButton) {
        return;
    }

    function showPopup(popup) {
        popupTitle.innerText = popup.title;
        popupContent.innerHTML = popup.html;
        popupContainer.style.display = 'flex';
    }

    function hidePopup() {
        popupContainer.style.display = 'none';
    }

    calculateDateBtn.addEventListener('click', async () => {
        const minDate = document.getElementById('min-date').value;
        const maxDate = document.getElementById('max-date').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (!minDate || !maxDate || !startTime || !endTime) {
            alert('Please fill in all fields');
            return;
        }

        // convert the 24 hour time strings to minute ints
        const startMins = startTime.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
        const endMins = endTime.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

        const response = await fetch(`/event/calculateDate/${eventdata.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                minDate,
                maxDate,
                startMins,
                endMins
            })
        })
        .then(response => {
            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                alert('Internal Server Error');
                return;
            }
            // Parse the JSON data from the response
            return response.json();
        })
        .then(data => {
            // Handle the parsed data
            console.log('Data received:', data);
        })
        .catch(error => {
            // Handle errors (network issues, JSON parsing errors, etc.)
            alert('There was a problem. Please try again later');
        });
    });

    settingsButton.addEventListener('click', () => {
        const eventUID = eventdata.uid; // Assuming eventdata.uid is available globally
        showPopup({
            html: editEventPopup.html(eventUID),
            title: editEventPopup.title
        });

        // Add event listener to close the popup when the close button is clicked
        closeBtn.addEventListener('click', () => {
            hidePopup();
        });

        // Add event listener to close the popup when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === popupContainer) {
                hidePopup();
            }
        });

        // Add event listener to handle submission
        const form = popupContent.querySelector('.eventForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries());

            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (response.ok) {
                hidePopup();
                location.reload();
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        });
    });

    inviteButton.addEventListener('click', () => {
        showPopup(addMemberPopup);

        // Add event listener to close the popup when the close button is clicked
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        // Add event listener to close the popup when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
            }
        });

        // Add event listener to invite user
        const submitBtn = document.getElementById('invite_button');
        submitBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const response = await fetch("/event/invite", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    eventUID: document.getElementById('eventUID').value
                })
            });

            if (response.ok) {
                alert('User invited successfully!');
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }

            document.body.removeChild(popup);
        });
    });
});
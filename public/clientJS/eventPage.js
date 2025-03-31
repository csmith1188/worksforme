const addMemberPopup = {
    html: `<input type="text" id="username" placeholder="Enter username or email">
            <input type="hidden" id="eventUID" value="${eventdata.uid}">
            <br><br>
            <button id="invite_button">Invite User</button>
            `,
    title: 'Invite User'
};

const editEventPopup = {
    html: `<form method="POST" action="/event/eventPage/<%= event.uid %>" class="eventForm">
                        <h3>Update Event</h3>
                        <input type="text" id="newEventName" name="newEventName" placeholder="New Event Name">
                        <input id="newEventDesc" name="newEventDesc" placeholder="New Event Description"></input>
                        <input type="hidden" name="eventUID" value="<%= event.uid %>">
                        <button type="submit" class="btn">Update Event</button>
                        <button type="submit" name="deleteEvent" value="true" class="btn btn-delete">Delete
                            Event</button>
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

    if (!inviteButton) {
        return;
    }

    function showPopup(popup){
        popupTitle.innerText = popup.title;
        popupContent.innerHTML = popup.html;
        popupContainer.style.display = 'flex';
    }

    function hidePopup(){
        popupContainer.style.display = 'none';
    }

    settingsButton.addEventListener('click', () => {
        showPopup(editEventPopup);

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
    });

    inviteButton.addEventListener('click', () => {

        showPopup(addMemberPopup);

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
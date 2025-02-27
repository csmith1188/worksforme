document.addEventListener('DOMContentLoaded', () => {
    const inviteButton = document.getElementById('invite-button');

    if (!inviteButton) {
        //console.error('Invite button not found!');
        return;
    }

    inviteButton.addEventListener('click', () => {
        //console.log('Invite button clicked!');

        // Create the popup
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close">&times;</span>
                <center>
                <h2>Invite User</h2>
                <div class="notif-utils">
                <span>
                    <input type="text" id="username" placeholder="Enter username or email">
                    <input type="hidden" id="eventUID" value="${eventdata.uid}">
                    <br>
                </span>
                    <button id="invite_button">Invite User</button>
                </div>
                </center>
            </div>
        `;

        // Append the popup to the body
        document.body.appendChild(popup);

        // Add event listener to close the popup when the close button is clicked
        const closeBtn = popup.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            //console.log('Close button clicked!');
            document.body.removeChild(popup);
        });

        // Add event listener to close the popup when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                //console.log('Clicked outside popup!');
                document.body.removeChild(popup);
            }
        });

        // Add event listener to invite user
        const inviteBtn = popup.querySelector('#invite_button');
        inviteBtn.addEventListener('click', async () => {
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
                alert('Failed to invite user, please try again.');
            }

            document.body.removeChild(popup);
        });

        // Debugging: Log the popup element
        //console.log('Popup created:', popup);
    });
});
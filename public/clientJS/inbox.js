document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch notifications from the server
        const response = await fetch('/user/inbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const inboxContainer = document.getElementById('inboxContainer');

        // Check if the response indicates success
        if (data.success) {
            if (data.notifications.length === 0) {
                // Display a message if there are no notifications
                const noNotificationsMessage = document.createElement('div');
                noNotificationsMessage.className = 'noNotificationsMessage';
                noNotificationsMessage.innerText = 'You have no notifications.';
                inboxContainer.appendChild(noNotificationsMessage);
            } else {
                // Iterate over each notification and create an inbox item
                data.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach((notification) => {
                    const inboxItem = document.createElement('div');
                    inboxItem.className = 'inboxItem';
                    let buttonHTML = '';

                    // Determine the icon and message for the notification based on its type
                    switch (notification.notif_type) {
                        case 'Invite':
                            buttonHTML = `<div class="button-container"><button class="check-mark">✔</button><button class="x-mark">✖</button></div>`;
                            inboxItem.innerHTML = `<i class="fas fa-bell"></i> ${notification.notif_type} to join ${notification.event}.`;
                            break;
                        case 'Message':
                            buttonHTML = `<div class="button-container"><button class="check-mark">✔</button><button class="x-mark">✖</button></div>`;
                            inboxItem.innerHTML = `<i class="fas fa-envelope"></i> ${notification.notif_type} from ${notification.sending_user}.`;
                            break;
                        case 'Alert':
                            buttonHTML = `<div class="button-container"><button class="x-mark">✖</button></div>`;
                            inboxItem.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${notification.notif_type} from ${notification.event}.`;
                            break;
                    }

                    // Append the buttonHTML to the inboxItem
                    inboxItem.innerHTML += buttonHTML;

                    // Add event listener to the check mark button
                    const checkMark = inboxItem.querySelector('.check-mark');
                    if (checkMark) {
                        checkMark.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            try {
                                const response = await fetch('/user/add', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        action: 'accept',
                                        notif_uid: notification.uid
                                    })
                                });

                                const data = await response.json();
                                if (data.success) {
                                    inboxItem.remove();
                                    window.location.reload();
                                } else {
                                    alert('Error accepting notification. Please contact support.');
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Error accepting notification. Please contact support.');
                            }
                        });
                    }

                    // Add event listener to the x-mark button (reject notification)
                    const xMark = inboxItem.querySelector('.x-mark');
                    if (xMark) {
                        xMark.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            try {
                                const response = await fetch('/user/add', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        action: 'reject',
                                        notif_uid: notification.uid
                                    })
                                });

                                const data = await response.json();
                                if (data.success) {
                                    alert('Notification rejected');
                                    inboxItem.remove();
                                    window.location.reload();
                                } else {
                                    alert('Error rejecting notification. Please contact support.');
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Error rejecting notification. Please contact support.');
                            }
                        });
                    }

                    // Click event to show a pop-up with more details
                    inboxItem.addEventListener('click', () => {
                        const popup = document.createElement('div');
                        popup.className = 'popup';
                        popup.innerHTML = `
                            <div class="popup-content">
                                <span class="close">&times;</span>
                                <h2>Notification Details</h2>
                                <div class="notif-utils">
                                    <div class="red-line"></div>
                                    <p><strong>Type:</strong> ${notification.notif_type}</p>
                                    <p><strong>Event:</strong> ${notification.event}</p>
                                    <p><strong>From:</strong> ${notification.sending_user}</p>
                                    <p><strong>Message:</strong> ${notification.notif_content}</p>
                                </div>
                                <br>
                                <div class="notif_buttons">
                                    <center>
                                        ${buttonHTML}
                                    </center>
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

                        // Add event listener to the check mark button
                        const checkMark = popup.querySelector('.check-mark');
                        if (checkMark) {
                            checkMark.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                try {
                                    const response = await fetch('/user/add', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            action: 'accept',
                                            notif_uid: notification.uid
                                        })
                                    });

                                    const data = await response.json();
                                    if (data.success) {
                                        alert('Notification accepted');
                                        window.location.reload();
                                        inboxItem.remove();
                                    } else {
                                        alert('Error accepting notification. Please contact support.');
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    alert('Error accepting notification. Please contact support.');
                                }
                            });
                        }

                        // Add event listener to the x-mark button (reject notification)
                        const xMark = popup.querySelector('.x-mark');
                        if (xMark) {
                            xMark.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                try {
                                    const response = await fetch('/user/add', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            action: 'reject',
                                            notif_uid: notification.uid
                                        })
                                    });

                                    const data = await response.json();
                                    if (data.success) {
                                        alert('Notification rejected');
                                        inboxItem.remove();
                                        window.location.reload();
                                    } else {
                                        alert('Error rejecting notification. Please contact support.');
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    alert('Error rejecting notification. Please contact support.');
                                }
                            });
                        }

                        document.body.appendChild(popup);
                    });
                    inboxContainer.appendChild(inboxItem);
                });
            }
        } else {
            // Alert the user if there was an error fetching notifications
            alert('Error fetching notifications. Please contact support IMMEDIATELY.');
        }
    } catch (error) {``
        // Alert the user if there was an error in the fetch request
        alert('Error fetching notifications. Please contact support IMMEDIATELY.');
    }
});
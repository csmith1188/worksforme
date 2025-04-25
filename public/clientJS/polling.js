document.addEventListener('DOMContentLoaded', () => {
    const createPollBtn = document.getElementById('create-poll-btn');

    createPollBtn?.addEventListener('click', async () => {
        const question = prompt('Enter poll question:');
        if (!question) return;

        const options = [];
        while (true) {
            const option = prompt('Enter poll option (leave blank to finish):');
            if (!option) break;
            options.push(option);
        }

        if (options.length === 0) {
            alert('Poll must have at least one option.');
            return;
        }

        const response = await fetch('/event/createPoll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventID, question, options })
        });

        if (response.ok) {
            alert('Poll created successfully!');
            location.reload();
        } else {
            const errorText = await response.text();
            console.error('Error creating poll:', errorText);
            alert('Failed to create poll. Check console for details.');
        }
    });

    document.querySelectorAll('.poll-option-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const optionID = button.dataset.optionId;
            const pollID = button.closest('.poll').dataset.pollId;

            const response = await fetch('/event/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pollID, optionID, userID: eventID })
            });

            if (response.ok) {
                alert('Vote recorded successfully!');
                location.reload();
            } else {
                const errorText = await response.text();
                console.error('Error voting:', errorText);
                alert('Failed to record vote.');
            }
        });
    });
});
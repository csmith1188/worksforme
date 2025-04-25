const db = require('../util/dbAsyncWrapper');

async function getPollsByEvent(eventID) {
    try {
        const polls = await db.all('SELECT * FROM polls WHERE event_id = ?', [eventID]);
        for (const poll of polls) {
            const options = await db.all(
                `SELECT po.option_id, po.option_text, 
                        COUNT(pv.vote_id) AS votes 
                 FROM poll_options po 
                 LEFT JOIN poll_votes pv ON po.option_id = pv.option_id 
                 WHERE po.poll_id = ? 
                 GROUP BY po.option_id`,
                [poll.poll_id]
            );
            poll.options = options;
        }
        return polls;
    } catch (error) {
        console.error('Error fetching polls:', error);
        throw error;
    }
}

async function createPoll(eventID, question) {
    try {
        console.log('Creating poll with eventID:', eventID, 'and question:', question); // Debug log
        const result = await db.run('INSERT INTO polls (event_id, question) VALUES (?, ?)', [eventID, question]);
        console.log('Poll created with result:', result); // Debug log
        return result.lastID; // Ensure the last inserted ID is returned
    } catch (error) {
        console.error('Error creating poll:', error);
        throw error;
    }
}

async function addPollOption(pollID, optionText) {
    try {
        console.log('Adding poll option with pollID:', pollID, 'and optionText:', optionText); // Debug log
        await db.run('INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)', [pollID, optionText]);
    } catch (error) {
        console.error('Error adding poll option:', error);
        throw error;
    }
}

async function addVote(pollID, optionID, userID) {
    try {
        await db.run('INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)', [pollID, optionID, userID]);
    } catch (error) {
        console.error('Error adding vote:', error);
        throw error;
    }
}

module.exports = {
    getPollsByEvent,
    createPoll,
    addPollOption,
    addVote
};

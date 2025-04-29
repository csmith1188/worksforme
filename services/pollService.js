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
        const result = await db.run('INSERT INTO polls (event_id, question) VALUES (?, ?)', [eventID, question]);
        return result.lastID; // Ensure the last inserted ID is returned
    } catch (error) {
        console.error('Error creating poll:', error);
        throw error;
    }
}

async function addPollOption(pollID, optionText) {
    try {
        await db.run('INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)', [pollID, optionText]);
    } catch (error) {
        console.error('Error adding poll option:', error);
        throw error;
    }
}

async function getUserVote(pollID, userID) {
    try {
        const sql = 'SELECT * FROM poll_votes WHERE poll_id = ? AND user_id = ?';
        return await db.get(sql, [pollID, userID]);
    } catch (error) {
        console.error('Error fetching user vote:', error);
        throw error;
    }
}

async function updateVote(voteID, optionID) {
    try {
        const sql = 'UPDATE poll_votes SET option_id = ? WHERE vote_id = ?';
        await db.run(sql, [optionID, voteID]);
    } catch (error) {
        console.error('Error updating vote:', error);
        throw error;
    }
}

async function addVote(pollID, optionID, userID) {
    try {
        const sql = 'INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)';
        await db.run(sql, [pollID, optionID, userID]);
    } catch (error) {
        console.error('Error adding vote:', error);
        throw error;
    }
}

async function getPollByID(pollID) {
    try {
        const poll = await db.get('SELECT * FROM polls WHERE poll_id = ?', [pollID]);
        const options = await db.all(
            `SELECT po.option_id, po.option_text, 
                    COUNT(pv.vote_id) AS votes 
             FROM poll_options po 
             LEFT JOIN poll_votes pv ON po.option_id = pv.option_id 
             WHERE po.poll_id = ? 
             GROUP BY po.option_id`,
            [pollID]
        );
        poll.options = options;
        return poll;
    } catch (error) {
        console.error('Error fetching poll by ID:', error);
        throw error;
    }
}

module.exports = {
    getPollsByEvent,
    createPoll,
    addPollOption,
    getUserVote,
    updateVote,
    addVote,
    getPollByID
};

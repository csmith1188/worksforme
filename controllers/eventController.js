const eventService = require('../services/eventService.js');
const notifservice = require('../services/notifService.js');
const memberHandle = require('../services/memberHandle.js');
const messageService = require('../services/messageService.js');
const messageBoardService = require('../services/messageBoardService.js');
const { MEMBER, ADMIN, OWNER } = require('../middleware/consts.js');
const { name } = require('ejs');

async function events(req, res) {
    const userUID = req.session.user.uid;
    const rows = await memberHandle.getEventsByMember(userUID);
    
    let events = [];
    for (let i = 0; i < rows.length; i++) {
        let event = await eventService.getEventByUID(rows[i].event_uid);
        if (event) {
            events.push({
                uid: rows[i].event_uid, // Ensure the uid is included
                ...event
            });
        }
    }

    res.render('pages/events/event', { events: events });
}

async function createEvent(req, res) {
    res.render('pages/events/createEvent');
}

async function createMB(req, res) {
    res.render('pages/events/createEventMB');
}

async function eventPage(req, res) {
    const aEvent = req.params.aEvent; // Get the event UID from the route parameter
    const event = await eventService.getEventByUID(aEvent); // Fetch the event details

    // Check the user's permission for the event
    const permission = await memberHandle.getMemberPermission(aEvent, req.session.user.uid);
    const isOwner = permission.permission === OWNER;

    // Fetch message boards associated with the event
    const messageBoards = await messageBoardService.getEventMBbyeventUID(aEvent);

    // Render the event page with the event details and message boards
    res.render('pages/events/eventPage', { event, isOwner, messageBoards });
}
    


async function postEventPage(req, res) {
    const aEvent = req.params.aEvent;
    const { newEventName, newEventDesc, deleteEvent } = req.body;

    try {
        if (deleteEvent === 'true') {
            await eventService.deleteEvent(aEvent);
            return res.status(200).send('Event deleted successfully');
        }

        if (newEventName) {
            await eventService.updateEventName(aEvent, newEventName);
        }

        if (newEventDesc) {
            await eventService.updateEventDescription(aEvent, newEventDesc);
        }

        res.redirect(`/event/eventPage/${aEvent}`);
    } catch (error) {
        console.error('Error in postEventPage:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function eventMB (req, res) {
    const aMB = req.params.aMB;

    console.log('chatroom opened:', aMB);

    db.all('SELECT user, text, date FROM message_comments WHERE board_uid = ? ORDER BY date ASC;', [aMB], (err, rows) => {
        if (err) {
            console.error(err);
            res.send("ERROR:\n" + err);
        } else {
            res.render('chatroom', { user: req.session.user, aMB: aMB, message_comments: rows });
        }
    });
}

async function posteventMB (req, res) {
    const aMB = req.params.aMB; 
    const user = req.session.user;
    const message = req.body.message;
    const date = new Date().toISOString();

    db.run('INSERT INTO message_comments (user, board_uid, text, date) VALUES (?, ?, ?, ?);', [user, aMB, message, date], (err) => {
        if (err) {
            res.send('DB ERROR:\n' + err);
        } else {
            res.redirect(`/event/eventMB/${aMB}`);
        }
    });
}

async function postCreateEvent(req, res) {
    const { name, description } = req.body;
    const creator = req.session.user.uid;

    let eventUID = await eventService.createEvent(name, description);

    // Creating a board for the event
    await messageService.addBoard(eventUID, name);

    // Insert the creator as a member in the members table
    await memberHandle.insertMembers(eventUID, creator, OWNER);

    res.redirect('/event/events');
}

async function postCreateMB(req, res) {
    const { title } = req.body;
    
}

async function addMessageBoard(req, res) {
    const { name } = req.body;
    const eventUID = req.params.aEvent; // Get the event UID from the route parameter
    const uid = crypto.randomUUID(); // Generate a unique ID for the message board

    try {
        // Create the message board and associate it with the event
        await messageBoardService.createMB(uid, name, eventUID);
        res.redirect(`/event/eventPage/${eventUID}`);
    } catch (error) {
        console.error('Error adding message board:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function invite(req, res) {
    const { username, eventUID } = req.body;
    const sendingUser = req.session.user.username;

    try {
        const user = await notifservice.getUidByNameOrEmail(username);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // Consts and checks for inviting later
        const members = await memberHandle.getMembersByEvent(eventUID);
        const notif = await notifservice.getNotificationsByUser(user.uid);
        const eventName = await notifservice.getEventNameByUID(eventUID);

        // If they are members
        const isMember = members.some(member => member.members === user.uid);
        // If they are invited
        const isNotif = notif.some(notification => notification.event === eventName.name);

        // If they are invited or members then dont continue
        if (isMember) {
            res.status(400).send('User is already a member of this event');
            return;
        }
        if (isNotif) {
            res.status(400).send('User has already been invited to this event');
            return;
        }

        let date = new Date();

        await notifservice.inviteNotifications('Invite', sendingUser, user.uid, eventName.name, 'You have been invited to an event.', date.toISOString(), eventUID);

        res.status(200).send('User invited successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function calculateDate(req, res) {
    const { eventID } = req.params;
    const { minDate, maxDate, startMins, endMins } = req.body;

    const dates = await eventService.calculateOptimalDates(eventID, minDate, maxDate, startMins, endMins);
    const datesArray = Array.from(dates);

    console.log(dates);

    // just get the first one
    const optimalDate = {
        date: datesArray[0][0],
        minutes: datesArray[0][1]
    }

    eventService.setEventDateTime(eventID, optimalDate.date, optimalDate.minutes);

    res.json(optimalDate);
}

module.exports = {
    events,
    createEvent,
    createMB,
    eventPage,
    postEventPage,
    eventMB,
    posteventMB,
    postCreateEvent,
    addMessageBoard,
    postCreateMB,
    invite,
    calculateDate
};
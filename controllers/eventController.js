const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sanitizeInput = require('../util/sanitizeInput');
const db = require('../util/dbAsyncWrapper');

const userService = require('../services/userService.js');
const eventService = require('../services/eventService.js');
const notifservice = require('../services/notifService.js');
const memberHandle = require('../services/memberHandle.js');
const { MEMBER, ADMIN, OWNER } = require('../middleware/consts.js');
const { date } = require('joi');

// Use for the members table
const member = 2;
const admin = 1;
const owner = 0;

async function events(req, res) {
    const userUID = req.session.user.uid;
    const rows = await memberHandle.getEventsByMember(userUID);
    
    let events = [];
    for (let i = 0; i < rows.length; i++) {
        let event = await eventService.getEventByUID(rows[i].event_uid);
        events.push(event);
    }

    res.render('pages/events/event', { events: events });
}

async function createEvent(req, res) {
    res.render('pages/events/createEvent');
}

async function eventPage(req, res) {
    const aEvent = req.params.aEvent;
    const event = await eventService.getEventByUID(aEvent);

    const permission = await memberHandle.getMemberPermission(aEvent, req.session.user.uid);
    const isOwner = permission.permission === OWNER;

    if (!event) {
        res.redirect('/event/events');
        return;
    }

    res.render('pages/events/eventPage', { event, isOwner });
}

async function postEventPage(req, res) {
    const aEvent = req.params.aEvent;
    const { newEventName, newEventDesc, deleteEvent } = req.body;

    if (newEventName) {
        await eventService.updateEventName(aEvent, newEventName);
    }

    if (newEventDesc) {
        await eventService.updateEventDescription(aEvent, newEventDesc);
    }

    if (deleteEvent) {
        await eventService.deleteEvent(aEvent);
    }

    res.redirect(`/event/eventPage/${aEvent}`);
}

async function postCreateEvent(req, res) {
    const { name, description } = req.body;
    const creator = req.session.user.uid;

    let eventUID = await eventService.createEvent(name, description);

    // Insert the creator as a member in the members table
    await memberHandle.insertMembers(eventUID, creator, OWNER);

    res.redirect('/event/events');
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
        // If they are members
        const isMember = members.some(member => member.members === user.uid);
        const notif = await notifservice.getNotificationsByUser(user.uid);
        const eventName = await notifservice.getEventNameByUID(eventUID);
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

module.exports = {
    events,
    createEvent,
    eventPage,
    postEventPage,
    postCreateEvent,
    invite
};
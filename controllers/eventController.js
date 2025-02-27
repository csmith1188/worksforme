const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sanitizeInput = require('../util/sanitizeInput');
const db = require('../util/dbAsyncWrapper');

const eventService = require('../services/eventService.js');
const notifServce = require('../services/notifServce.js');
const { log } = require('console');
const e = require('express');

async function events(req, res) {
    const userUID = req.session.user.uid;
    const rows = await eventService.getEventsByUserUID(userUID);
    res.render('pages/events/event', { events: rows });
}

async function createEvent(req, res) {
    res.render('pages/events/createEvent');
}

async function eventPage(req, res) {
    const aEvent = req.params.aEvent;

    const event = await eventService.getEventByUID(aEvent);
    const eventMB = await eventService.getEventsMB();
    
    const userUID = req.session.user.uid;
    const isCreator = await eventService.isEventCreator(aEvent, userUID);

    res.render('pages/events/eventPage', { event, eventMB, isCreator });
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
    const { uid, name, description } = req.body;
    const creator = req.session.user.uid;

    await eventService.createEvent(uid, name, description, creator);
    res.redirect('/event/events');
}

async function invite(req, res) {
    const { username, eventUID } = req.body;
    const sendingUser = req.session.user.username;
    //console.log(username, eventUID, sendingUser);

    try {
        const user = await notifServce.getUidByNameOrEmail(username);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        await notifServce.addUserToEvent(user.uid, eventUID);
        const eventName = await notifServce.getEventNameByUID(eventUID);
        await notifServce.inviteNotifications('Invite', sendingUser, user.uid, eventName.name, 'You have been invited to an event.');

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
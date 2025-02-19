const jwt = require('jsonwebtoken');
const urlHelper = require('../util/urlHelper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sanitizeInput = require('../util/sanitizeInput');
const db = require('../util/dbAsyncWrapper');

const eventService = require('../services/eventService.js');

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
    const userUID = req.session.user.uid;
    const isCreator = await eventService.isEventCreator(aEvent, userUID);

    if (!event) {
        res.redirect('/event/events');
        return;
    }

    res.render('pages/events/eventPage', { event, isCreator });
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

module.exports = {
    events,
    createEvent,
    eventPage,
    postEventPage,
    postCreateEvent
};
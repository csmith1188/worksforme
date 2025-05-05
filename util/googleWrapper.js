const { google } = require('googleapis');

const SCOPES = [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar'
];

function getOAuthClient(refreshToken = null) {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    if (refreshToken){
        client.setCredentials({
            refresh_token: refreshToken
        });
    }

    return client;
}

function getAuthUrl(oauth2Client = null) {
    let client = (oauth2Client) ? oauth2Client : getOAuthClient();
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
}

module.exports = {
    getOAuthClient
}
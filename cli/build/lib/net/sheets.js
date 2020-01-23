"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const googleapis_1 = require("googleapis");
const path = require("path");
const read_1 = require("@xblox/fs/read");
const write_1 = require("@xblox/fs/write");
// https://developers.google.com/sheets/api/quickstart/nodejs
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            write_1.sync(TOKEN_PATH, JSON.stringify(token, null, 2));
            return oAuth2Client;
        });
    });
});
const readSheet = (auth, sheet, range) => __awaiter(void 0, void 0, void 0, function* () {
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
    const res = yield sheets.spreadsheets.values.get({
        spreadsheetId: sheet,
        range: range,
    });
    return res.data.values;
    /*
    sheets.spreadsheets.values.get({
        spreadsheetId: sheet,
        range: range,
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[4]}`);
            });
            return rows;
        } else {
            console.log('No data found.');
        }
    });
    */
});
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const token = read_1.sync(TOKEN_PATH, 'string');
    if (!token) {
        return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
    /*
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        callback(oAuth2Client);
    });
    */
});
exports.read = (sheet, range) => __awaiter(void 0, void 0, void 0, function* () {
    // Load client secrets from a local file.
    const creds = read_1.sync(path.resolve('credentials.json'), 'json');
    const client = yield authorize(creds);
    const cells = yield readSheet(client, sheet, range);
    console.log('cells', cells);
});
//# sourceMappingURL=sheets.js.map
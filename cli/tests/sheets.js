var GoogleSpreadsheet = require('google-spreadsheet');

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('1oVEiGH4o3SV-mAA3Mb-WNVJMyYl4VMxLjWjrSw_ipJY');

var sheet;
const path = require('path');
async function setAuth(next) {
    // see notes below for authentication instructions!
    var creds = require(path.resolve('./gcreds.json'));
    // OR, if you cannot save the file locally (like on heroku)
    var creds_json = {
        client_email: 'yourserviceaccountemailhere@google.com',
        private_key: 'your long private key stuff here'
    }

    doc.useServiceAccountAuth(creds, (err) => {
        console.log('happened', err);
        next();
    });
}

async function main() {
    await setAuth(() => {
        console.log('done');
        doc.getInfo((err, info) => {
            if (err) {
                console.error('error', err);
            }
            console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
            sheet = info.worksheets[0];
            console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);

            sheet.getCells({
                'min-row': 1,
                'max-row': 5,
                'return-empty': false
            }, function (err, cells) {
                var cell = cells[0];
                console.log('Cell R' + cell.row + 'C' + cell.col + ' = ' + cell.value);
            });


            sheet.getRows({
                offset: 0
            }, function (err, rows) {
                console.log('Read ' + rows.length + ' rows', rows);
            });


        });

    });

}

main();

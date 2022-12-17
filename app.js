const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const { firstName, lastName, email } = req.body;
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us13.api.mailchimp.com/3.0/lists/53b124ef0c';
    const options = {
        method: 'POST',
        auth: 'sickoovit:68f6ac2fe2e14e6c43684886e98f735a-us13',
    };

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure', function (req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server running on port 3000');
});

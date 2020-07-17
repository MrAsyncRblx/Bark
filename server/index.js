const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit')

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/bark')
const barks = db.get('barks');
const filter = new Filter();

app.use(cors());
app.use(express.json());

function IsValidBark(bark) {
    return bark.name && bark.name.toString().trim() !== '' &&
        bark.content && bark.content.toString().trim() !== ''
}

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Bark!"
    });
});

app.get("/barks", (req, res) => {
    barks
        .find()
        .then(bark => {
            res.json(bark);
        });
});

app.use(rateLimit({
    windowMs: 30 * 1000, //30 seconds
    max: 1
}));

app.post("/barks", (req, res) => {
    if (IsValidBark(req.body)) {
        const bark = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        barks.insert(bark).then(createdBark => {
                res.json(createdBark);
            });
    } else {
        res.status(422),
        res.json({
            message: "Name and text are required!"
        });
    }
});

app.listen(5000, () => {
    console.log("Listening on http://localhost:5000");
});
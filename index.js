var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var { User } = require('./models/user');
var { Item } = require('./models/item');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.use(cors({ origin: 'http://localhost:4200' }));

mongoose.connect('mongodb://test:test@ds123698.mlab.com:23698/symplicity-test', function() {
    console.log('Server Connected');
})

app.all("/*", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.post('/user', (req, res) => {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    })
    user.save((data) => {
        res.send({
            message: true,
            success: data
        })
    })
})

app.post('/item', (req, res) => {
    var item = new Item({
        name: req.body.name,
    })
    item.save((data) => {
        res.send({
            message: true,
            success: data
        })
    })
})

app.get('/getUser/:username', (req, res) => {
    console.log(req.params.username);
    User.find({ username: req.params.username }).then((data) => {
        res.send(data);
    })
})

app.get('/getItem/:name', (req, res) => {

    Item.findOne({ name: req.params.name }).then((data) => {
        res.send(data);
    })
})

app.get('/getAllItem', (req, res) => {
    console.log('here');
    Item.find().then((data) => {
        res.send(data);
    })
})

app.get('/getUser/:username', (req, res) => {
    console.log(req.params.username);
    User.find({ username: req.params.username }).then((data) => {
        res.send(data);
    })
})

app.post('/updateItem', (req, res) => {
    console.log(req.body);
    if (!req.body.name) {
        console.log('Name missing');
    } else {
        Item.findOne({ name: req.body.name }).then((data) => {
            console.log('Data is ', data);
            if (data.votedBy == null) {
                console.log('votedBy is null');
                Item.findOneAndUpdate({ name: req.body.name }, {
                    $push: {
                        'votedBy': req.body.person
                    },
                    $set: {
                        'votes': votes + 1
                    }
                }, function(err, data) {
                    res.send({
                        success: true,
                        message: data
                    })
                })
            } else {
                if (data.votedBy.includes(req.body.person)) {
                    res.send({
                        success: false,
                        message: 'You have already Liked it'
                    })
                } else {
                    var votes = data.votes;
                    Item.findOneAndUpdate({ name: req.body.name }, {
                        $push: {
                            'votedBy': req.body.person
                        },
                        $set: {
                            'votes': votes + 1
                        }
                    }, function(err, data) {
                        res.send({
                            success: true,
                            message: data
                        })
                    })
                }
            }
        })
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, function() {
    console.log('Connected');
})
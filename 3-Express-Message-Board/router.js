const express = require('express');
const router = express.Router();

const messages = [
    {
        text: "Hello!",
        user: "Bob",
        added: new Date(),
    },
    {
        text: "Hey Bob!",
        user: "Alice",
        added: new Date(),
    }
]

// GET homepage
router.get('/', (req, res) => {
    res.render('index', {title: "Message board index", messages: messages});
});

// GET new 
router.get('/new', (req, res) => {
    res.render('new', {msg_nb: messages.length});
})

// POST new
router.post('/new', (req, res) => {
    messages.push({
        text: req.body.message,
        user: req.body.name,
        added: new Date(),
    });
    res.redirect('/');
})

module.exports = router;
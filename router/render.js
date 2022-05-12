const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home')
})

router.get('/member', (req, res) => {
    res.render('pages/member')
})

router.get('/match', (req, res) => {
    res.render('pages/match')
})

router.get('/message', (req, res) => {
    res.render('pages/message')
})

module.exports = router;
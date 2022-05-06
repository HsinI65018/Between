const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('pages/home')
})

app.get('/member', (req, res) => {
    res.render('pages/member')
})

app.get('/match', (req, res) => {
    res.render('pages/match')
})

app.get('/message', (req, res) => {
    res.render('pages/message')
})

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log('Server listen at port 3000');
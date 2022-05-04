const express = require('express');
const engine = require('ejs-locals');

const app = express();

app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log('Server listen at port 3000');
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(`${__dirname}/screens/index.html`));
});

// app.get('/', function (req, res) {

//     res.render('screens/index');
// });

app.use('/', router);


app.listen(process.env.port || 3000);

console.log('Running at port 3000');
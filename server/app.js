const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))
app.use('/', routes);
app.use(cookieParser())
app.use(function(req, res, next) {
    const token = req.cookies.jwt;
    jwt.verify(token, 'my secret', function(err, decodedToken) {
        if (err) console.log('Ovde je greska')
        else {
            req.user = decodedToken;
            // Add to req object
            return next();
        }
    });
});




app.listen(port, () => {
    console.log(` App running on localhost: ${port} `);
});
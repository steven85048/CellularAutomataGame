// express for routing
var express = require('express');
var app = express();

// for error messages
var morgan = require('morgan');
app.use(morgan('dev'));

// set the default path for static files
app.use(express.static(__dirname + "/views"));
app.engine('html', require('ejs').renderFile);

// ===================================================================================================
// ============================================== ROUTING ============================================
// ===================================================================================================

// default route
app.get('/', (req, res) => {
    res.render('pages/start.html');
});

// for retrieving game config
app.get('/getGameConfig', (req, res) => {
    res.send(gameConfig);
});

app.listen(8000 || process.env.PORT, () => console.log("App listening on port 8000"));
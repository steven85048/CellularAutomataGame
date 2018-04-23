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

var port = process.env.PORT || 8000;
app.listen(port, () => console.log("App listening on port 8000"));
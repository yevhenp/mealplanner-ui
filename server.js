// //Install express server
// const express = require('express');
// const path = require('path');
// const app = express();
//
// // Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist/meal-planner'));
//
// // For all GET requests, send back index.html
// // so that PathLocationStrategy can be used
// app.get('/*', function(req,res) {
//     res.sendFile(path.join(__dirname + '/dist/meal-planner/index.html'));
// });
//
// // Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8000;
const server = require('http').Server(app);

app.use(express.static(__dirname, 'dist/meal-planner', {index: false}));


server.listen(port, function() {
    console.log("App running on port " + port);
})

// PathLocationStrategy

app.get('', function(req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});
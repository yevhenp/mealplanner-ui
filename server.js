//Install express server
const express = require('express');
const http = require('http');
const path = require('path');

console.log('The path is ' + path);
console.log('directory is ' + __dirname);
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname, '/dist/meal-planner')));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/', (req,res) => {
    console.log('The path is ' + path);
    console.log('directory is ' + __dirname);
    res.send(path.join(__dirname, '/dist/meal-planner/index.html'));
});

const port = process.env.PORT || 8080;
app.set('port', port);

// Start the app by listening on the default Heroku port
const server = http.createServer(app);
server.listen(port, () => console.log('Running on port ' + port));
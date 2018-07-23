const clients = require('restify-clients');
 
// Creates a JSON client
exports.pivotalTracker = clients.createJsonClient('https://www.pivotaltracker.com');

const clients = require('restify-clients')
const {common} = require('../lib/commands/common')
 
// Creates a JSON client
exports.pivotalTracker = clients.createJsonClient('https://www.pivotaltracker.com');

exports.setOptions = (context, endpoint) =>
  ({
    path: endpoint,
    headers: {
      'X-TrackerToken': context.globalState.get(common.globals.APItoken)
      }
  })

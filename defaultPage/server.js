var liveServer = require("live-server");
var execute = require('child_process').exec;

var params = {
    port: 8181, // Set the server port. Defaults to 8080. 
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.  
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
    browser: "firefox",
    mount: [
        ['/components', './node_modules']
    ], // Mount a directory to a route. 
    ignore: 'scss',
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots 
    middleware: [function(req, res, next) {
            next();
        }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
};
liveServer.start(params);


/*liveServer.watcher.on("change", function(changePath) {
    if (changePath.endsWith(".scss")) {
        execute("npm run scss");
    } else if (changePath.endsWith(".js") && !changePath.endsWith("main.js")) {
        execute("npm run js");
    }
})*/

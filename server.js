const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const exec = require('child_process').exec;
const opn = require('opn');


//mes fichiers
const diskManager = require("./jsServer/diskManager");
const projectCreator = require("./jsServer/projectCreator");
const projectReader = require("./jsServer/projectReader");
const phpManager = require("./jsServer/phpManager");
const apiManager = require("./jsServer/apiManager");


//mes variables
var projectPath = "";
var DiskAv = [];

app.get('*', function (req, res) {
    res.sendFile(__dirname + req.url);
});

io.on('connection', function (socket) {
    console.log('a user connected');


    socket.on("setProjectPath", function (data) {
        projectPath = data;
        if (diskManager.projectExist(data)) {
            socket.emit("pathSet", "exist");
        } else {
            socket.emit("pathSet", "create");
        }
    })

    socket.on('createProject', function (data) {
        var info = data;
        projectCreator.createDefaultProject(projectPath, info, socket).then(() => {
            if (info.php) {
                projectCreator.addPHPInfo(projectPath, info, socket);
            }
            if (info.scss) {
                projectCreator.addScssInfo(projectPath, info, socket);
            }
            if (info.materialize) {
                projectCreator.addMaterializeInfo(projectPath, info, socket);
            }
            if (info.angular) {

            }
            if (info.api) {
                projectCreator.addAPIInfo(projectPath, info, socket);
            }
            projectCreator.createIndex(projectPath, info, socket);
            socket.emit("projectCreated", "");
        })

    })

    socket.on("getDisks", function () {
        console.log('list')
        diskManager.listDrives().then((data) => socket.emit('listDisks', data));
    })

    socket.on("getChild", function (data) {
        socket.emit("listChilds", diskManager.getFiles(data));
    })

    socket.on("getInfoproject", function () {
        socket.emit("infoProject", projectReader.readProjectInfo(projectPath));
    })
    socket.on("getPHP", function () {
        socket.emit("PHPObjs", phpManager.readPhpObject(projectPath));
    })
    socket.on("savePHP", function (data) {
        phpManager.parsePhpObject(data, projectPath);
    })
    socket.on("saveAPI", function (data) {
        apiManager.saveAPI(data, projectPath);
    })
    socket.on("getAPI", function(){
        socket.emit("APIObjs", apiManager.getAPI(projectPath));
    })
});



http.listen(1995, function () {
    console.log('listening on *:1995');
    opn('http://127.0.0.1:1995', { app: 'firefox' })
    /*exec('start http://127.0.0.1:1995', function() {

    })*/
});

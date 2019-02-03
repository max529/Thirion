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
const nodeManager = require("./jsServer/nodeManager");
const apiManager = require("./jsServer/apiManager");
const sqlManager = require("./jsServer/sqlManager");


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
            if (info.nodejs) {
                projectCreator.addNodeJSInfo(projectPath, info, socket);
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
        if (projectPath != "") {
            socket.emit("infoProject", projectReader.readProjectInfo(projectPath));
        }
    })
    socket.on("getPHP", function () {
        socket.emit("PHPObjs", phpManager.readPhpObject(projectPath));
    })
    socket.on("savePHP", function (data) {
        var link = data[1];
        data = data[0];
        sqlManager.parseData(data, link, projectPath);
        phpManager.parsePhpObject(data, link, projectPath);
    })
    socket.on("saveNodeJS", function (data) {
        var link = data[1];
        data = data[0];
        sqlManager.parseData(data, link, projectPath);
        nodeManager.parseObject(data, link, projectPath);
    })
    socket.on("saveAPI", function (data) {
        apiManager.saveAPI(data, projectPath);
    })
    socket.on("getAPI", function () {
        socket.emit("APIObjs", apiManager.getAPI(projectPath));
    })
});


function execute(command, callback) {
    exec(command, function (error, stdout, stderr) { callback(stdout); });
};

var port = 1995;

execute('netstat -a -o -n', function (res) {
    var t = res.split('\r\n');
    var started = false;
    for (var i = 0; i < t.length; i++) {
        var t2 = t[i].replace(/ +(?= )/g, '');
        t2 = t2.split(" ")
        var t3 = t2[2];
        if (t3 != undefined) {
            var t4 = t3.split(":");
            t4 = t4[t4.length - 1];
            if (t4 == port) {
                var idProcess = t2[t2.length - 1];
                i = t.length;
                started = true;
                execute('taskkill /F /PID ' + idProcess, function (res) {
                    http.listen(1995, function () {
                        console.log('listening on *:1995');
                        //opn('http://127.0.0.1:1995', { app: 'firefox' })
                    });
                });
            }

        }

    }
    if (!started) {
        http.listen(1995, function () {
            console.log('listening on *:1995');
            //opn('http://127.0.0.1:1995', { app: 'firefox' })
        });
    }
})


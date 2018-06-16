module.exports = {
    createDefaultProject: function (path, info, socket) {
        const fs = require('fs');
        const exec = require('child_process').execSync;
        const getos = require('getos')
        return new Promise((resolve, reject) => {

            fs.writeFileSync(path + "project.config.json", JSON.stringify(info));

            pathTemp = path + "css";
            fs.mkdirSync(pathTemp);

            pathTemp = path + "js";
            fs.mkdirSync(pathTemp);

            pathTemp = path + "media";
            fs.mkdirSync(pathTemp);

            getos(function (e, os) {
                var cmd = "";
                if (os.os == "windows") {
                    cmd = path.substring(0, 2) + " && cd " + path + " && npm install";
                } else {
                    cmd = "cd " + path + " && npm install";
                }
                if (!info.scss) {
                    var packageJSON = {
                        name: info.name,
                        version: "1.0.0",
                        description: "",
                        main: "index.js",
                        scripts: {
                            "dev": "node server.js"
                        },
                        author: "",
                        license: "ISC",
                        devDependencies: {
                            "live-server": "^1.1.0"
                        }
                    }
    
                    fs.writeFileSync(path + "package.json", JSON.stringify(packageJSON));
                    exec(cmd, function () { })
    
    
                    var strTemp = fs.readFileSync(__dirname + '/../defaultPage/server.js');
                    fs.writeFileSync(path + "server.js", strTemp);
    
                }
                socket.emit("projectOnCreation", "Default project created");
                resolve();
            })
            


            

        })




    },



    addPHPInfo: function (path, info, socket) {
        const fs = require('fs');

        pathTemp = path + ".object";
        fs.mkdirSync(pathTemp);

        pathTemp = path + "php";
        fs.mkdirSync(pathTemp);

        pathTemp = path + "php/class";
        fs.mkdirSync(pathTemp);

        pathPhp = path + "php/";

        fs.writeFileSync(pathPhp + "traitement.php", "//fichier central des transitions");

        var strTemp = fs.readFileSync(__dirname + '/../defaultPage/loader.php');
        fs.writeFileSync(pathPhp + "loader.php", strTemp);


        var connFile = `<?php
    $servername = "` + info.db.host + `";
    $username = "` + info.db.username + `";
    $password = "` + info.db.pass + `";
    $dbname = "` + info.db.name + `";
?>`;

        fs.writeFileSync(pathPhp + "conn.php", connFile);
        socket.emit("projectOnCreation", "PHP added")
    },

    addAPIInfo: function(path, info, socket){
        const fs = require('fs');

        pathTemp = path + "api";
        fs.mkdirSync(pathTemp);


        var defaulthtaccess = fs.readFileSync(__dirname+"/../defaultPage/.htaccessApi");
        fs.writeFileSync(path+".htaccess", defaulthtaccess);

    },

    addScssInfo: function (path, info, socket) {
        const fs = require('fs');
        const exec = require('child_process').execSync;

        pathTemp = path + "scss";
        fs.mkdirSync(pathTemp);

        fs.writeFileSync(path + "scss/default.scss", "");

        var packageJSON = {
            name: info.name,
            version: "1.0.0",
            description: "",
            main: "index.js",
            scripts: {
                "dev": "npm run scss & node server.js",
                "scss": "node-sass scss -o css --output-style compressed"
            },
            author: "",
            license: "ISC",
            devDependencies: {
                "live-server": "^1.1.0",
                "node-sass": "^4.3.0"
            }
        }

        fs.writeFileSync(path + "package.json", JSON.stringify(packageJSON));

        cmd = path.substring(0, 2) + " && cd " + path + " && npm install";
        exec(cmd);

        var strTemp = fs.readFileSync(__dirname + '/../defaultPage/serverScss.js');
        fs.writeFileSync(path + "server.js", strTemp);

        var indexFile = `<!DOCTYPE html>
<html>
<head>
    <title></title>
    <link rel="stylesheet" href="/css/default.css">
</head>
<body>
    <h1>it's working</h1>
</body>
</html>`;
        fs.writeFileSync(path + "index.html", strTemp);


        socket.emit("projectOnCreation", "SCSS added");
    },


    addMaterializeInfo: function (path, info, socket) {
    	/*const fs = require('fs');
    	const unzip = require('unzip');

        pathTemp = path + "libs";
        fs.mkdirSync(pathTemp);

        fs.createReadStream(__dirname + '/../defaultPage/materialize.zip').pipe(unzip.Extract({ path: pathTemp }));

       	socket.emit("projectOnCreation", "Materialize added");*/
    },


    createIndex: function (path, info, socket) {
        const fs = require('fs');

        var addon = "";
        if (info.materialize) {
            addon += `<link rel="stylesheet" href="/libs/css/materialize.min.css">
<script src="/libs/js/materialize.min.js"></script>`;
        }
        if (info.scss) {
            addon += `<link rel="stylesheet" href="/css/default.css">`;
        }

        var indexFile = `<!DOCTYPE html>
<html>
<head>
    <title></title>
    `+ addon + `
</head>
<body>
    <h1>it's working</h1>
</body>
</html>`;
        fs.writeFileSync(path + "index.html", indexFile);

        socket.emit("projectOnCreation", "index added");
    },


    createAngular: function (path, info, socket) {
        const fs = require('fs');

        pathTemp = path + "partials";
        fs.mkdirSync(pathTemp);

        pathTemp = path + "js/ctrl";
        fs.mkdirSync(pathTemp);
    }

};
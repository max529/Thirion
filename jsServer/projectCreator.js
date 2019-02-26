module.exports = {
    createDefaultProject: function (path, info, socket) {
        const fs = require('fs');
        const exec = require('child_process').execSync;
        const getos = require('getos')
        return new Promise((resolve, reject) => {

            fs.writeFileSync(path + "project.config.json", JSON.stringify(info));
            if (!info.nodejs) {
                pathTemp = path + "css";
                fs.mkdirSync(pathTemp);

                pathTemp = path + "js";
                fs.mkdirSync(pathTemp);

                pathTemp = path + "media";
                fs.mkdirSync(pathTemp);

                var strTemp = fs.readFileSync(__dirname + '/../defaultPage/server.js');
                fs.writeFileSync(path + "server.js", strTemp);
            }

            getos(function (e, os) {
                var cmd = "";
                if (os.os == "windows") {
                    cmd = path.substring(0, 2) + " && cd " + path + " && npm install";
                } else {
                    cmd = "cd " + path + " && npm install";
                }
                if (!info.scss) {
                    var dependencies = {};
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
                        dependencies: dependencies,
                        devDependencies: {
                            "live-server": "^1.1.0"
                        }
                    }

                    fs.writeFileSync(path + "package.json", JSON.stringify(packageJSON));
                    exec(cmd, function () { })

                }
                socket.emit("projectOnCreation", "Default project created");
                resolve();
            })
        })
    },

    addNodeJSInfo: function (path, info, socket) {
        const fs = require('fs');
        const exec = require('child_process').execSync;

        var cmd = path.substring(0, 2) + " && cd " + path + " && express --view=pug -f";
        exec(cmd, function () { })
        pathTemp = path + ".object";
        fs.mkdirSync(pathTemp);

        pathTemp = path + "model";
        fs.mkdirSync(pathTemp);

        var pathModel = path + "model/";
        var connFile = fs.readFileSync(__dirname + '/../defaultPage/conn.js', 'utf8');
        fs.writeFileSync(pathModel + "conn.js", connFile);
        var mssqlFile = fs.readFileSync(__dirname + '/../defaultPage/mssql.js', 'utf8');
        mssqlFile = mssqlFile
            .replace("hostDB", info.db.host)
            .replace("userDB", info.db.username)
            .replace("passwordDB", info.db.pass)
            .replace("nameDB", info.db.name)
        fs.writeFileSync(pathModel + "mssql.js", mssqlFile);

        var mysqlFile = fs.readFileSync(__dirname + '/../defaultPage/mysql.js', 'utf8');
        mysqlFile = mysqlFile
            .replace("hostDB", info.db.host)
            .replace("userDB", info.db.username)
            .replace("passwordDB", info.db.pass)
            .replace("nameDB", info.db.name)
        fs.writeFileSync(pathModel + "mysql.js", mysqlFile);

        var utilsFile = fs.readFileSync(__dirname + '/../defaultPage/utils.js', 'utf8');
        fs.writeFileSync(pathModel + "utils.js", utilsFile);

        fs.renameSync(path + 'public/stylesheets', path + 'public/css');
        fs.renameSync(path + 'public/javascripts', path + 'public/js');
        fs.renameSync(path + 'public/images', path + 'public/img');

        var layoutFile = fs.readFileSync(__dirname + '/../defaultPage/defaultPug/layout.pug', 'utf8');
        fs.writeFileSync(path + "views/layout.pug", layoutFile);

        var styleFile = fs.readFileSync(__dirname + '/../defaultPage/defaultcss/style.css', 'utf8');
        fs.writeFileSync(path + "public/css/style.css", styleFile);

        styleFile = fs.readFileSync(__dirname + '/../defaultPage/defaultcss/materialize.min.css', 'utf8');
        fs.writeFileSync(path + "public/css/materialize.min.css", styleFile);

        var jqueryFile = fs.readFileSync(__dirname + '/../defaultPage/defaultJs/jquery.min.js', 'utf8');
        fs.writeFileSync(path + "public/js/jquery.min.js", jqueryFile);

        var materializeFile = fs.readFileSync(__dirname + '/../defaultPage/defaultJs/materialize.min.js', 'utf8');
        fs.writeFileSync(path + "public/js/materialize.min.js", materializeFile);

        var defaultjsFile = fs.readFileSync(__dirname + '/../defaultPage/defaultJs/default.js', 'utf8');
        fs.writeFileSync(path + "public/js/default.js", defaultjsFile);

        var cmd = path.substring(0, 2) + " && cd " + path + " && npm i --save mysql2 && npm i";
        exec(cmd, function () { })
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

    addAPIInfo: function (path, info, socket) {
        const fs = require('fs');

        pathTemp = path + "api";
        fs.mkdirSync(pathTemp);


        var defaulthtaccess = fs.readFileSync(__dirname + "/../defaultPage/.htaccessApi");
        fs.writeFileSync(path + ".htaccess", defaulthtaccess);

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
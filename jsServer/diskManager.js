module.exports = {
    listDrives: function () {
        return new Promise((resolve, reject) => {
            var getos = require('getos')

            getos(function (e, os) {
                if (e) return console.log(e)
                console.log("Your OS is:" + JSON.stringify(os))
                if (os.os.indexOf('win')!=-1) {
                    const spawn = require("child_process").spawn;
                    const list = spawn('cmd');


                    list.stdout.on('data', function (data) {
                        const output = String(data)
                        const out = output.split("\r\n").map(e => e.trim()).filter(e => e != "")
                        if (out[0] === "Name") {
                            resolve(out.slice(1))
                        }
                    });

                    list.stderr.on('data', function (data) { });

                    list.on('exit', function (code) {
                        if (code !== 0) {
                            reject(code)
                        }
                    });

                    list.stdin.write('wmic logicaldisk get name\n');
                    list.stdin.end();
                }else{
                    resolve(['/'])
                }
            })



        })
    },
    getFiles: function (path) {
        const fs = require('fs');

        var data = [];
        console.log("child of " + path);
        fs.readdirSync(path).forEach(file => {

            var escPath = path + file;
            try {
                var fileInfo = fs.lstatSync(escPath);
                if (fileInfo.isDirectory()) {
                    temp = [file, "folder"];
                    data.push(file);
                }
            } catch (err) {

            }

        })
        return data;
    },
    projectExist: function (path2) {
        const fs = require('fs');
        path2 += "project.config.json";
        console.log("check path " + path2)
        try {
            var fileInfo = fs.lstatSync(path2);
            return true;
        } catch (err) {
            return false;
        }

        console.log(fileInfo);
    }
}

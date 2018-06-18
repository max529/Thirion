const fs = require('fs');
const phpManager = require("./phpManager");

module.exports = {
    getAPI: function (path) {
        var pathConfig = path + "project.config.json";
        var config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'));
        if (config["apiSettings"]) {
            return config.apiSettings;
        } else {
            return {};
        }
    },
    saveAPI: function (data, path) {
        var pathConfig = path + "project.config.json";

        var config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'));
        config["apiSettings"] = data;
        fs.writeFileSync(pathConfig, JSON.stringify(config));
        if (!data.needAuth) {
            var index = fs.readFileSync(__dirname + "/../defaultPage/indexApi_withoutAuth.php", 'utf8');
            fs.writeFileSync(path + "api/index.php", index);
            var functions = phpManager.parsePhpFile(path + "php/class/" + data.obj.name + ".class.php");
            var txt = '<?php\n\tclass ' + data.obj.name + '{\n\t\tvar $conn;\n';
            for (var i = 0; i < functions.length; i++) {
                if (functions[i].name != 'checkToken' && functions[i].name != 'connect') {
                    txt += functions[i].text;
                }
            }
            txt +="\t}\n?>";
            fs.writeFileSync(path + "php/class/" + data.obj.name + ".class.php",txt);
        } else {
            var index = fs.readFileSync(__dirname + "/../defaultPage/indexApi_withAuth.php", 'utf8');
            index = index.replace(/classToLoad/g, data.obj.name);
            index = index.replace(/tokenProp/g, data.propName[0]);
            fs.writeFileSync(path + "api/index.php", index);

            var functions = phpManager.parsePhpFile(path + "php/class/" + data.obj.name + ".class.php");
            var txt = '<?php\n\tclass ' + data.obj.name + '{\n\t\tvar $conn;\n';
            for (var i = 0; i < functions.length; i++) {
                if (functions[i].name != 'checkToken' && functions[i].name != 'connect') {
                    txt += functions[i].text;
                }
            }
            txt += '\t\tpublic function checkToken($'+data.propName[0]+'){\n\t\t\t$conn = $this->conn;\n\t\t\t$sql="SELECT COUNT(*) as nb FROM '+data.obj.name+' WHERE '+data.propName[0]+' = :'+data.propName[0]+'";\n\t\t\t$stat = $conn->prepare($sql);\n\t\t\t$stat->bindParam(":'+data.propName[0]+'",$'+data.propName[0]+');\n\t\t\t$stat->execute();\n\t\t\t$nb = $stat->fetch(PDO::FETCH_LAZY)["nb"];\n\t\t\tif($nb!=1){\n\t\t\t\treturn false;\n\t\t\t}\n\t\t\treturn true;\n\t\t}\n';
            txt += '\t\tpublic function connect($'+data.username[0]+',$'+data.password[0]+'){\n\t\t\t$conn = $this->conn;\n\t\t\t$sql="SELECT * FROM '+data.obj.name+' WHERE '+data.username[0]+'=:'+data.username[0]+' AND '+data.password[0]+'=:'+data.password[0]+'";\n\t\t\t$stat = $conn->prepare($sql);\n\t\t\t$stat->bindParam(":'+data.username[0]+'",$'+data.username[0]+');\n\t\t\t$stat->bindParam(":'+data.password[0]+'",$'+data.password[0]+');\n\t\t\t$stat->execute();\n\t\t\t$res = $stat->fetch(PDO::FETCH_LAZY);\n\t\t\tif($res[\''+data.password[0]+'\'] == $'+data.password[0]+' && $res[\''+data.password[0]+'\'] != "" ){\n\t\t\t\treturn $res[\''+data.propName[0]+'\'];\n\t\t\t}\n\t\t\treturn \'error\';\n\t\t}\n';
            txt +="\t}\n?>";
            fs.writeFileSync(path + "php/class/" + data.obj.name + ".class.php",txt);

            var connect = fs.readFileSync(__dirname+"/../defaultPage/apiLogin.php",'utf8');
            connect = connect.replace(/classToLoad/g, data.obj.name);
            connect = connect.replace(/usernameProp/g, data.username[0]);
            connect = connect.replace(/passwordProp/g, data.password[0]);
            fs.writeFileSync(path + "apiLogin.php", connect);

        }
        console.log(data);
    }
}
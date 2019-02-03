const fs = require('fs');
var self = module.exports = {
    readPhpObject: function (path) {
        const glob = require('glob');
        var pathTemp = path + ".object/";

        var res = {
            data : [],
            link : []
        };

        var files = fs.readdirSync(pathTemp);
        files.forEach(function (file) {
            var content = JSON.parse(fs.readFileSync(pathTemp + file, 'utf8'));
            if (file != 'link') {
                res.data.push(content);
            } else{
                res.link = content
            }
        })
        return res;

    },
    parsePhpObject: function (data, link, path) {
        fs.writeFileSync(path + ".object/link", JSON.stringify(link));
        for (var i = 0; i < data.length; i++) {
            var ob = data[i];
            self.createPhpObject(data, path, ob);
            /*if (ob.action == "create") {
                self.createPhpObject(data, path, ob);
            } else if (ob.action == "update") {
                fs.writeFileSync(path + "/" + ob.id, JSON.stringify(ob));
            }*/
        }
    },

    createPhpObject: function (data, path, object) {
        var pathTemp = path + ".object";
        var pathPhp = path + "php";

        object.action = "";
        fs.writeFileSync(pathTemp + "/" + object.id, JSON.stringify(object));

        var className = object.name;
        var classNameLower = object.name.toLowerCase();

        //$titre,$url,$descr,$pic
        var insertPropPhp = "";
        //`titreArticle`, `url`, `descr`
        var insertProp = "";
        //:titre,:url,:descr
        var insertVar = "";
        //$stat->bindParam(":titre",$titre);
        var insertPrep = '';


        //$id,$titre,$url,$descr,$pic
        var updatePropPhp = "";
        //titreArticle`=:titre,`url`=:url,`descr`=:descr
        var updateProp = "";
        //idArticle=:id
        var updateWhere = ""
        //$stat->bindParam(":titre",$titre);
        var updatePrep = "";


        //$id
        var deletePropPhp = "";
        //idArticle = :id
        var deleteWhere = "";
        //$stat->bindParam(':id',$id);
        var deletePrep = "";

        //$id
        var selectByIdPropPhp = "";
        //idArticle = :id
        var selectByIdWhere = "";
        //$stat->bindParam(':id',$id);
        var selectByIdPrep = "";


        //generation du contenu
        for (var prop in object.prop) {
            //si pas primary
            if (!object.prop[prop][2]) {
                insertPropPhp += "$" + object.prop[prop][0] + ",";
                insertProp += object.prop[prop][0] + ",";
                insertVar += ":" + object.prop[prop][0] + ",";
                insertPrep += '$stat->bindParam(":' + object.prop[prop][0] + '",$' + object.prop[prop][0] + ');\n';

                updatePropPhp += "$" + object.prop[prop][0] + ",";
                updateProp += object.prop[prop][0] + "=:" + object.prop[prop][0] + ",";
                updatePrep += '$stat->bindParam(":' + object.prop[prop][0] + '",$' + object.prop[prop][0] + ');\n';
            } else {
                updatePropPhp += "$" + object.prop[prop][0] + ",";
                updateWhere += object.prop[prop][0] + "=:" + object.prop[prop][0] + ",";
                updatePrep += '$stat->bindParam(":' + object.prop[prop][0] + '",$' + object.prop[prop][0] + ');\n';

                deletePropPhp += "$" + object.prop[prop][0] + ",";
                deleteWhere = object.prop[prop][0] + "=:" + object.prop[prop][0] + ",";
                deletePrep += '$stat->bindParam(":' + object.prop[prop][0] + '",$' + object.prop[prop][0] + ');\n';

                selectByIdPropPhp += "$" + object.prop[prop][0] + ",";
                selectByIdWhere = object.prop[prop][0] + "=:" + object.prop[prop][0] + ",";
                selectByIdPrep += '$stat->bindParam(":' + object.prop[prop][0] + '",$' + object.prop[prop][0] + ');\n';
            }
        }

        //suppression de la , finale
        var insertPropPhp = insertPropPhp.slice(0, -1);
        var insertProp = insertProp.slice(0, -1);
        var insertVar = insertVar.slice(0, -1);

        var updatePropPhp = updatePropPhp.slice(0, -1);
        var updateProp = updateProp.slice(0, -1);
        var updateWhere = updateWhere.slice(0, -1);

        var deletePropPhp = deletePropPhp.slice(0, -1);
        var deleteWhere = deleteWhere.slice(0, -1);

        var selectByIdPropPhp = selectByIdPropPhp.slice(0, -1);
        var selectByIdWhere = selectByIdWhere.slice(0, -1);

        //creation des sentences

        //INSERT INTO DefaultClassNameLower(`titreArticle`, `url`, `descr`) VALUES (:titre,:url,:descr)
        var insertSentence = "INSERT INTO " + classNameLower + "(" + insertProp + ") VALUES (" + insertVar + ")";
        //UPDATE DefaultClassNameLower SET `titreArticle`=:titre,`url`=:url,`descr`=:descr WHERE idArticle=:id
        var updateSentence = "UPDATE " + classNameLower + " SET " + updateProp + " WHERE " + updateWhere;
        //DELETE FROM DefaultClassNameLower WHERE idArticle = :id
        var deleteSentence = "DELETE FROM " + classNameLower + " WHERE " + deleteWhere;
        //SELECT * FROM DefaultClassNameLower
        var selectAllSentence = "SELECT * FROM " + classNameLower;
        //SELECT * FROM DefaultClassNameLower WHERE id=:id
        var selectByIdSentence = "SELECT * FROM " + classNameLower + " WHERE " + selectByIdWhere

        //get default file
        var content = fs.readFileSync(__dirname + '/../defaultPage/default.class.php', "utf8");
        content = content.replace(/DefaultClassName/g, className);
        content = content.replace(/insertPropPhp/g, insertPropPhp);
        content = content.replace(/insertSentence/g, insertSentence);
        content = content.replace(/insertPrep/g, insertPrep);

        content = content.replace(/updatePropPhp/g, updatePropPhp);
        content = content.replace(/updateSentence/g, updateSentence);
        content = content.replace(/updatePrep/g, updatePrep);

        content = content.replace(/deletePropPhp/g, deletePropPhp);
        content = content.replace(/deleteSentence/g, deleteSentence);
        content = content.replace(/deletePrep/g, deletePrep);

        content = content.replace(/selectAllSentence/g, selectAllSentence);

        content = content.replace(/selectByIdPropPhp/g, selectByIdPropPhp);
        content = content.replace(/selectByIdSentence/g, selectByIdSentence);
        content = content.replace(/selectByIdPrep/g, selectByIdPrep);



        fs.writeFileSync(pathPhp + "/class/" + object.name + ".class.php", content);
    },
    parsePhpFile: function (path) {
        var content = fs.readFileSync(path, "utf8");
        var content = content.replace("<?php", "").replace("?>", "").trim();
        content = content.replace(/class [a-zA-z]*{/g, "").trim();
        content = content.slice(0, content.lastIndexOf("}")).trim();
        var lignes = content.split("\n");
        var listFunction = [];
        var temp = "";
        var isInFunction = false;
        for (var i = 0; i < lignes.length; i++) {
            if (lignes[i].indexOf("function") != -1) {
                isInFunction = true;
                temp = lignes[i] + "\n";
            } else if (isInFunction) {
                temp += lignes[i] + "\n";
                if (lignes[i].indexOf("}") != -1) {
                    var analyse = this._analyseFunction(temp);
                    listFunction.push(analyse);
                    temp = "";
                    isInFunction = false;
                }
            }
        }
        return listFunction;
    },
    _analyseFunction(func) {
        var info = func.match(/.*function .*{/g)[0];
        info = info.replace("function ", "").replace("{", "").trim();
        info = info.split(" ");
        console.log(info);
        var params = info[1].match(/\(.*\)/g)[0];
        info[1] = info[1].replace(params, "");
        params = params.replace("(", "").replace(")", "");
        if (params != "") {
            params = params.split(",");
        } else {
            params = []
        }
        var res = {
            type: info[0],
            name: info[1],
            params: params,
            text: func
        }
        return res;
    }
}
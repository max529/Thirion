const glob = require('glob');
const fs = require('fs');
var self = module.exports = {
    readObject: function (path) {
        var pathTemp = path + ".object/";

        var res = [];

        var files = fs.readdirSync(pathTemp);
        files.forEach(function (file) {
            //console.log(file);
            var content = JSON.parse(fs.readFileSync(pathTemp + file, 'utf8'));
            //console.log(content);

            res.push(content);
        })
        return res;
    },
    parseObject: function (data, link, path) {
        fs.writeFileSync(path + ".object/link", JSON.stringify(link));
        for (var i = 0; i < data.length; i++) {
            var ob = data[i];
            self.createObject(data, path, ob);
            /*if (ob.action == "create") {
                self.createPhpObject(data, path, ob);
            } else if (ob.action == "update") {
                fs.writeFileSync(path + "/" + ob.id, JSON.stringify(ob));
            }*/
        }
    },
    createObject: function (data, path, object) {
        var pathTemp = path + ".object";
        var pathPhp = path + "model";

        object.action = "";
        fs.writeFileSync(pathTemp + "/" + object.id, JSON.stringify(object));

        var className = object.name;
        var classNameLower = object.name.toLowerCase();
        console.log('create ' + className);

        //`titreArticle`, `url`, `descr`
        var insertProp = "";
        //?,?,?
        var insertAskDot = "";
        //[nom,prenom]
        var insertVar = "[";


        var updateProp = "";
        var updatePropSentence = "";
        var updateWhere = "";
        var updateVar = "";
        var updateVar1 = "[";
        var updateVar2 = "";

        var deleteProp = "";
        var deletePropSentence = "";
        var deleteVar = "[";

        var selectByIdProp = "";
        var selectByIdPropSentence = "";
        var selectByIdVar = "[";

        //generation du contenu
        for (var prop in object.prop) {
            //si pas primary
            if (!object.prop[prop][2]) {
                insertProp += object.prop[prop][0] + ",";
                insertAskDot += "?,";
                insertVar += object.prop[prop][0] + ","

                updateProp += object.prop[prop][0] + ",";
                updatePropSentence += object.prop[prop][0] + "=?,";
                updateVar1 += object.prop[prop][0] + ",";
            } else {
                updateProp += object.prop[prop][0] + ",";
                updateWhere += object.prop[prop][0] + "=? AND ";
                updateVar2 += object.prop[prop][0] + ",";

                deleteProp += object.prop[prop][0] + ",";
                deletePropSentence += object.prop[prop][0] + "=? AND ";
                deleteVar += object.prop[prop][0] + ",";

                selectByIdProp += object.prop[prop][0] + ",";
                selectByIdPropSentence += object.prop[prop][0] + "=? AND ";
                selectByIdVar += object.prop[prop][0] + ",";
            }
        }

        //suppression de la , finale
        insertProp = insertProp.slice(0, -1);
        insertAskDot = insertAskDot.slice(0, -1);
        insertVar = insertVar.slice(0, -1) + "]";

        updateProp = updateProp.slice(0, -1);
        updatePropSentence = updatePropSentence.slice(0, -1)
        updateWhere = updateWhere.slice(0, -5);
        updateVar = updateVar1 + updateVar2.slice(0, -1) + "]";

        deleteProp = deleteProp.slice(0, -1);
        deletePropSentence = deletePropSentence.slice(0, -5);
        deleteVar = deleteVar.slice(0, -1) + "]";

        selectByIdProp = selectByIdProp.slice(0, -1);
        selectByIdPropSentence = selectByIdPropSentence.slice(0, -5);
        selectByIdVar = selectByIdVar.slice(0, -1) + "]"

        //INSERT INTO DefaultClassNameLower(`titreArticle`, `url`, `descr`) VALUES (:titre,:url,:descr)
        var insertSentence = "INSERT INTO " + classNameLower + "(" + insertProp + ") VALUES (" + insertAskDot + ")";
        var updateSentence = "UPDATE " + classNameLower + " SET " + updatePropSentence + " WHERE " + updateWhere;
        var deleteSentence = "DELETE FROM " + classNameLower + " WHERE " + deletePropSentence;
        var selectAllSentence = "SELECT * FROM " + classNameLower;
        var selectByIdSentence = "SELECT * FROM " + classNameLower + " WHERE " + selectByIdPropSentence;

        //get default file
        var content = fs.readFileSync(__dirname + '/../defaultPage/default.class.js', "utf8");
        content = content.replace(/DefaultObject/g, className);
        content = content.replace(/insertProp/g, insertProp);
        content = content.replace(/insertSentence/g, insertSentence);
        content = content.replace(/insertVar/g, insertVar);

        content = content.replace(/updateProp/g, updateProp);
        content = content.replace(/updateSentence/g, updateSentence);
        content = content.replace(/updateVar/g, updateVar);

        content = content.replace(/deleteProp/g, deleteProp);
        content = content.replace(/deleteSentence/g, deleteSentence);
        content = content.replace(/deleteVar/g, deleteVar);

        content = content.replace(/selectAllSentence/g, selectAllSentence);

        content = content.replace(/selectByIdProp/g, selectByIdProp);
        content = content.replace(/selectByIdSentence/g, selectByIdSentence);
        content = content.replace(/selectByIdVar/g, selectByIdVar);

        fs.writeFileSync(path + "/model/" + className + ".class.js", content);
        self.createRoute(data, path, object, updateProp, insertProp);
    },
    createRoute: function (data, path, object, updateProp, insertProp) {
        var className = object.name;
        var routeFile = fs.readFileSync(path + "routes/index.js", "utf8");
        var lines = routeFile.split("\n");
        var lineToInsert = 0;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("module.exports")) {
                lineToInsert = i - 1;
            }
        }
        var lineToAdd = "";
        var requireToAdd = "";
        var usedOneTime = false;

        // Add 
        if (routeFile.indexOf("router.get('/" + className + "/add',") == -1) {
            var addLine = [
                "router.get('/" + className + "/add', function(req, res, next) {",
                "\tres.render('" + className + "/add', {});",
                "});"
            ]
            addLine = addLine.join("\n") + "\n";
            lineToAdd += addLine;
            usedOneTime = true;
        }
        if (routeFile.indexOf("router.post('/" + className + "/add',") == -1) {
            var propTemp = "req.body." + insertProp.replace(/,/g, ",req.body.");
            var addLine = [
                "router.post('/" + className + "/add', function(req, res, next) {",
                "\t" + className + ".add(" + propTemp + ").then(() => {",
                "\t\tres.redirect('/" + className + "');",
                "\t})",
                "});"
            ]
            addLine = addLine.join("\n") + "\n";
            lineToAdd += addLine;
            usedOneTime = true;
        }
        // Get All
        if (routeFile.indexOf("router.get('/" + className + "',") == -1) {
            var getAllLine = [
                "router.get('/" + className + "', function(req, res, next) {",
                "\t" + className + ".getAll().then((list) => {",
                "\t\tres.render('" + className + "/index', {list: list});",
                "\t})",
                "});"
            ]
            getAllLine = getAllLine.join("\n") + "\n";
            lineToAdd += getAllLine;
            usedOneTime = true;
        }
        // Update
        if (routeFile.indexOf("router.get('/" + className + "/:id',") == -1) {
            var updateLine = [
                "router.get('/" + className + "/:id', function(req, res, next) {",
                "\t" + className + ".getById(req.params.id).then((item) => {",
                "\t\tres.render('" + className + "/update', {item: item});",
                "\t})",
                "});"
            ]
            updateLine = updateLine.join("\n") + "\n";
            lineToAdd += updateLine;
            usedOneTime = true;
        }
        if (routeFile.indexOf("router.post('/" + className + "/:id',") == -1) {
            var propTemp = "req.body." + updateProp.replace(/,/g, ",req.body.");
            var updateLine = [
                "router.post('/" + className + "/:id', function(req, res, next) {",
                "\t" + className + ".update(" + propTemp + ").then((item) => {",
                "\t\tres.redirect('/" + className + "')",
                "\t})",
                "});"
            ]
            updateLine = updateLine.join("\n") + "\n";
            lineToAdd += updateLine;
            usedOneTime = true;
        }
        if (routeFile.indexOf("router.get('/" + className + "/delete/:id',") == -1) {
            var deleteLine = [
                "router.get('/" + className + "/delete/:id', function(req, res, next) {",
                "\t" + className + ".delete(req.params.id).then(() => {",
                "\t\tres.redirect('/" + className + "')",
                "\t})",
                "});"
            ]
            deleteLine = deleteLine.join("\n") + "\n";
            lineToAdd += deleteLine;
            usedOneTime = true;
        }

        if (usedOneTime) {
            if (routeFile.indexOf("var " + className + " =") == -1) {
                requireToAdd += "var " + className + " = require('../model/" + className + ".class.js');\n"
            }
        }
        // write route
        var routeCtx = requireToAdd;
        for (var i = 0; i < lines.length; i++) {
            routeCtx += lines[i] + "\n";
            if (i == lineToInsert) {
                routeCtx += lineToAdd;
            }
        }
        fs.writeFileSync(path + "routes/index.js", routeCtx);
        self.createView(data, path, object);
    },
    createView: function (data, path, object) {
        var className = object.name;
        var viewFolder = path + "views/" + className;
        if (!fs.existsSync(viewFolder)) {
            fs.mkdirSync(viewFolder);
        }

        var indexTableHeader = "";
        var indexTableContent = "";
        var indexPrimary = [];

        var updateHidden = "";
        var updateForm = "";
        
        var insertForm = "";
        for (var prop in object.prop) {
            //si pas primary
            if (!object.prop[prop][2]) {
                indexTableHeader += "                th " + object.prop[prop][0] + "\n";
                indexTableContent += "                    td= item." + object.prop[prop][0] + "\n";

                updateForm += '        div\n            label(for="' + object.prop[prop][0] + '") ' + object.prop[prop][0] + '\n            input#' + object.prop[prop][0] + '(type="text", value=""+item.' + object.prop[prop][0] + ', name="' + object.prop[prop][0] + '")\n'
                insertForm += '        div\n            label(for="' + object.prop[prop][0] + '") ' + object.prop[prop][0] + '\n            input#' + object.prop[prop][0] + '(type="text", value="", name="' + object.prop[prop][0] + '")\n'
            } else {
                indexTableHeader += "                th " + object.prop[prop][0] + "\n";
                indexTableContent += "                    td= item." + object.prop[prop][0] + "\n";
                indexPrimary.push(object.prop[prop][0])

                updateHidden += '        input(type="hidden", name="' + object.prop[prop][0] + '", value=""+item.' + object.prop[prop][0] + ')\n'
            }
        }
        indexTableHeader += "                th Action";
        indexTableContent += "                    td\n                        a(href=\"/" + className + "/\"+item." + indexPrimary[0] + ") Edit\n                        a(href=\"/" + className + "/delete/\"+item." + indexPrimary[0] + ") Delete"

        var indexPug = fs.readFileSync(__dirname + '/../defaultPage/defaultPug/index.pug', 'utf8');
        indexPug = indexPug.replace(/indexTableHeader/g, indexTableHeader);
        indexPug = indexPug.replace(/indexTableContent/g, indexTableContent);
        indexPug = indexPug.replace(/className/g, className);
        fs.writeFileSync(viewFolder + "/index.pug", indexPug);

        var updatePug = fs.readFileSync(__dirname + '/../defaultPage/defaultPug/update.pug', 'utf8');
        updatePug = updatePug.replace(/className/g, className);
        updatePug = updatePug.replace(/updateHidden/g, updateHidden);
        updatePug = updatePug.replace(/updateForm/g, updateForm);
        fs.writeFileSync(viewFolder + "/update.pug", updatePug);

        var addPug = fs.readFileSync(__dirname + '/../defaultPage/defaultPug/add.pug', 'utf8');
        addPug = addPug.replace(/className/g, className);
        addPug = addPug.replace(/insertForm/g, insertForm);
        fs.writeFileSync(viewFolder + "/add.pug", addPug);
    }
}
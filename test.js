var fs = require('fs');

console.log(listFunction("C:\\Users\\maxim\\Desktop\\temp\\php\\class\\User.class.php"));

function listFunction(path) {
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
                var analyse = analyseFunction(temp);
                listFunction.push(analyse);
                temp = "";
                isInFunction = false;
            }
        }
    }
    return listFunction;
}

function analyseFunction(func) {
    var info = func.match(/.*function .*{/g)[0];
    info = info.replace("function ", "").replace("{", "").trim();
    info = info.split(" ");
    var params = info[1].match(/\(.*\)/g)[0];
    info[1] = info[1].replace(params, "");
    params = params.replace("(", "").replace(")", "");
    if (params != "") {
        params = params.split(",");
    }else{
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
app.controller('projectCtrl', function ($scope, ajaxHelper, $http, $timeout, $compile) {
    $scope.info = {};
    $scope.page = "";
    $scope.idphpObject = -1;
    $scope.currentLine = null;
    $scope.phpObject = [{
        "id": "1495114066365",
        "action": "",
        "name": "Object1",
        "posx": "89",
        "posy": "70",
        "prop": [
            ["id", "int", true],
            ["name", "string", false],
            ["prop3", "string", false]
        ]
    }];
    $scope.apiInfo = {
        obj: "1495114066365",
        needAuth: true,
        propName: "id",
        username: "",
        password: ""
    }
    $scope.objectSelectPhp = {};
    $scope.linkBetweenObject = [];


    $scope.init = function () {
        // if (path == '') {
        //     window.location = '/';
        // }
        $scope.page = "info";
        angular.element(document.getElementById('nav')).scope().reset();
        socket.emit("getInfoproject");
        document.getElementById('listAction').style.height = document.getElementById("view").offsetHeight + 'px';
        $('.modal').modal();
        $('select').formSelect();
    }
    $scope.createObjectPhp = function () {
        var time = Date.now();
        var a = {
            "id": "" + time + "",
            "action": "create",
            "name": "Object" + time,
            "posx": "0",
            "posy": "0",
            "prop": [
                ["id", "int", true]
            ]
        }
        $scope.phpObject.push(a);
    }
    $scope.setInfo = function (res) {
        $timeout(function () {
            $scope.info = res;
        }, 0)
        $timeout(function () {
            M.updateTextFields();
        }, 200)
    }
    $scope.setPhpObject = function (res) {
        console.log(res);
        $timeout(function () {
            $scope.phpObject = res.data;
            $scope.linkBetweenObject = res.link;
            for (var i = 0; i < $scope.linkBetweenObject.length; i++) {
                var el = document.createElementNS('http://www.w3.org/2000/svg', 'g')
                el.setAttribute("el1", $scope.linkBetweenObject[i].el1);
                el.setAttribute("el2", $scope.linkBetweenObject[i].el2);
                el.innerHTML = '<line onclick="selectLine(this)" stroke="red" style="stroke-width:5"/><text fill="black" transform="">N1</text><text fill="black" transform="">N2</text>';
                document.getElementById("linkLayer").appendChild(el);
            }
        }, 0);
        $timeout(function () {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
            $scope.redrawAll();
        }, 0);
    }
    $scope.setAPIObject = function (res) {
        $timeout(function () {
            $scope.apiInfo = res;
        }, 0);
        $timeout(function () {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }, 0);
    }
    $scope.selectTab = function (ev, page) {
        if ($scope.page != page) {
            $scope.page = page;
            angular.element(document.getElementById('nav')).scope().reset();
            if (page == "php" || page == 'nodejs') {
                angular.element(document.getElementById('nav')).scope().setValidate(1);
                socket.emit("getPHP");
            } else if (page == 'api') {
                angular.element(document.getElementById('nav')).scope().setValidate(1);
                socket.emit("getPHP");
                socket.emit("getAPI");
                $timeout(function () {
                    var elems = document.querySelectorAll('select');
                    var instances = M.FormSelect.init(elems, {});
                }, 0);
            }
            $("#listAction .collection-item").removeClass('active');
            $(ev.target).addClass('active');
        }
    }
    $scope.validate = function () {
        if ($scope.page == "php") {
            socket.emit("savePHP", [$scope.phpObject, $scope.linkBetweenObject]);
            M.toast({
                html: 'Modèle mise à jour',
                displayLength: 4000
            });
        } else if ($scope.page == "nodejs") {
            socket.emit("saveNodeJS", [$scope.phpObject, $scope.linkBetweenObject]);
            M.toast({
                html: 'Modèle mise à jour',
                displayLength: 4000
            });
        } else if ($scope.page == "api") {
            socket.emit("saveAPI", $scope.apiInfo)
            M.toast({
                html: 'API mise à jour',
                displayLength: 4000
            });
        }
    }
    $scope.infoModal = function (ind) {
        $scope.objectSelectPhp = angular.copy($scope.phpObject[ind]);
        $scope.idphpObject = ind;
        $timeout(function () {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }, 0)

        $('#infoObject').modal('open');
    }
    $scope.addProp = function () {
        var a = ['', 'int', false];
        $scope.objectSelectPhp.prop.push(a);
        $timeout(function () {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }, 0)
    }
    $scope.removeProp = function (id) {
        $scope.objectSelectPhp.prop.splice(id, 1);
    }
    $scope.validateObject = function () {
        $scope.phpObject[$scope.idphpObject] = angular.copy($scope.objectSelectPhp);
        if ($scope.phpObject[$scope.idphpObject].action != "create") {
            $scope.phpObject[$scope.idphpObject].action = "update";
        }
    }
    $scope.suppObject = function () {
        console.log("supp")
        $scope.phpObject[$scope.idphpObject] = angular.copy($scope.objectSelectPhp);
        if ($scope.phpObject[$scope.idphpObject].action != "create") {
            $scope.phpObject[$scope.idphpObject].action = "delete";
        } else {
            console.log("supp2")
            $scope.phpObject.splice($scope.idphpObject, 1);
        }
    }
    $scope.setPosition = function (posArr, posX, posY) {
        $scope.phpObject[posArr].posx = posX;
        $scope.phpObject[posArr].posy = posY;
    }
    $scope.updateAPI = function () {
        $timeout(function () {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }, 0);
    }
    $scope.updateAuth = function () {
        $timeout(function () {
            if (!$scope.apiInfo.needAuth) {
                jQuery('select').attr("disabled", "disabled")
            } else {
                jQuery('select').removeAttr("disabled")
            }
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }, 0);
    }
    $scope.startLink = function (e) {
        var t = e.currentTarget;
        var posinarray = t.parentNode.attributes["posinarray"].value;
        var id = $scope.phpObject[posinarray].id;
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        var x1 = t.offsetLeft + Number(t.parentNode.attributes["data-x"].value) + 2.5;
        var y1 = t.offsetTop + Number(t.parentNode.attributes["data-y"].value) + 2.5;
        el.setAttribute("el1", id);
        el.innerHTML = '<line onclick="selectLine(this)" x1="' + x1 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="red" style="stroke-width:5"/><text x="' + x1 + '" y="' + y1 + '" fill="black" transform="">N1</text><text x="' + x1 + '" y="' + y1 + '" fill="black" transform="">N2</text>';
        document.getElementById("linkLayer").appendChild(el);
        $compile(el)($scope)
        var listConns = document.getElementsByClassName('connectorLeft');
        for (var i = 0; i < listConns.length; i++) {
            listConns[i].style.width = "20px"
            listConns[i].style.left = "-20px"
            listConns[i].style.height = "20px"
        }
        var listConns = document.getElementsByClassName('connectorRight');
        for (var i = 0; i < listConns.length; i++) {
            listConns[i].style.width = "20px"
            listConns[i].style.right = "-20px"
            listConns[i].style.height = "20px"
        }
        $timeout(function () {
            $scope.currentLine = el;

        })
    }
    $scope.moveLine = function (e) {
        if ($scope.currentLine != null) {
            if (e.target == document.getElementById("objectCont") || e.target.nodeName == "svg") {
                $scope.currentLine.children[0].setAttribute("x2", e.originalEvent.layerX);
                $scope.currentLine.children[0].setAttribute("y2", e.originalEvent.layerY);
            }
        }
    }
    $scope.stopLine = function (e) {
        if ($scope.currentLine != null) {
            var t = e.target;
            console.log(t);
            if (t.classList.contains("connectorRight")) {
                var x2 = t.offsetLeft + Number(t.parentNode.attributes["data-x"].value) - 2.5;
                var y2 = t.offsetTop + Number(t.parentNode.attributes["data-y"].value) + 2.5;
                $scope.currentLine.children[0].setAttribute("x2", x2);
                $scope.currentLine.children[0].setAttribute("y2", y2);
                var posinarray = t.parentNode.attributes["posinarray"].value;
                var id = $scope.phpObject[posinarray].id;
                $scope.currentLine.setAttribute("el2", id);
                $scope.linkBetweenObject.push({
                    el1: $scope.currentLine.attributes["el1"].value,
                    el2: id
                })
                $scope.calculatePos($scope.currentLine);
            } else if (t.classList.contains("connectorLeft")) {
                var x2 = t.offsetLeft + Number(t.parentNode.attributes["data-x"].value) - 2.5;
                var y2 = t.offsetTop + Number(t.parentNode.attributes["data-y"].value) - 2.5;
                $scope.currentLine.children[0].setAttribute("x2", x2);
                $scope.currentLine.children[0].setAttribute("y2", y2);
                var posinarray = t.parentNode.attributes["posinarray"].value;
                var id = $scope.phpObject[posinarray].id;
                $scope.currentLine.setAttribute("el2", id);
                $scope.linkBetweenObject.push({
                    el1: $scope.currentLine.attributes["el1"].value,
                    el2: id
                })
                $scope.calculatePos($scope.currentLine);
            } else {
                $scope.currentLine.parentNode.removeChild($scope.currentLine);
            }
            $scope.currentLine = null;
        }
    }
    $scope.redrawAll = function () {
        for (var i = 0; i < $scope.linkBetweenObject.length; i++) {
            var current = $scope.linkBetweenObject[i];
            var ligne = document.querySelector('g[el1="' + current.el1 + '"][el2="' + current.el2 + '"]');
            if (ligne == null) {
                ligne = document.querySelector('g[el1="' + current.el2 + '"][el2="' + current.el1 + '"]');
            }
            $scope.calculatePos(ligne)
            console.log(ligne);
        }
    }
    $scope.calculatePos = function (ligne) {
        //reset size
        var timer = 750;
        var listConns = document.getElementsByClassName('connectorLeft');
        if (listConns[0].style.width == '5px') {
            timer = 0;
        }
        for (var i = 0; i < listConns.length; i++) {
            listConns[i].style.width = "5px"
            listConns[i].style.left = "-5px"
            listConns[i].style.height = "5px"
        }
        var listConns = document.getElementsByClassName('connectorRight');
        for (var i = 0; i < listConns.length; i++) {
            listConns[i].style.width = "5px"
            listConns[i].style.right = "-5px"
            listConns[i].style.height = "5px"
        }
        setTimeout(function () {
            //element 1 is the left one
            if (!ligne.attributes["el1"] || !ligne.attributes["el2"]) {
                ligne.parentNode.removeChild(ligne);
                return;
            }
            var el1 = ligne.attributes["el1"].value;
            var el2 = ligne.attributes["el2"].value;
            var child1 = 1;
            var child2 = 2;
            el1 = document.getElementById('object' + el1);
            el2 = document.getElementById('object' + el2);
            // swap if we are wrong
            if (Number(el1.attributes["data-x"].value) > Number(el2.attributes["data-x"].value)) {
                var temp = el1;
                el1 = el2;
                el2 = temp;
                temp = child1;
                child1 = child2;
                child2 = temp;
            }

            var connRight = el1.querySelector(".connectorRight");
            var connLeft = el2.querySelector(".connectorLeft");

            var x1 = connRight.offsetLeft + Number(connRight.parentNode.attributes["data-x"].value) + 2.5;
            var y1 = connRight.offsetTop + Number(connRight.parentNode.attributes["data-y"].value) + 2.5;
            var x2 = connLeft.offsetLeft + Number(connLeft.parentNode.attributes["data-x"].value) + 2.5;
            var y2 = connLeft.offsetTop + Number(connLeft.parentNode.attributes["data-y"].value) + 2.5;

            ligne.children[0].setAttribute("x1", x1);
            ligne.children[0].setAttribute("y1", y1);
            ligne.children[0].setAttribute("x2", x2);
            ligne.children[0].setAttribute("y2", y2);

            var calcVector = function (x0, y0, x1, y1) {
                return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2))
            }

            //label 1
            var x0 = x2;
            var y0 = y1;
            var v1 = calcVector(x1, y1, x0, y0);
            var v2 = calcVector(x1, y1, x2, y2);
            var v3 = calcVector(x0, y0, x2, y2);
            var angle = Math.acos((Math.pow(v1, 2) + Math.pow(v2, 2) - Math.pow(v3, 2)) / (2 * v1 * v2))
            angle = (angle * 180 / Math.PI);
            ligne.children[child1].setAttribute("x", x1 + 10);
            ligne.children[child1].setAttribute("y", y1 + 20);
            if (y1 - y2 > 0) {
                ligne.children[child1].setAttribute("transform", "rotate(-" + angle + ", " + x1 + "," + y1 + ")")
            } else {
                ligne.children[child1].setAttribute("transform", "rotate(" + angle + ", " + x1 + "," + y1 + ")")
            }
            //label 2
            // var x0 = x2;
            // var y0 = y1;
            // var v1 = calcVector(x2, y2, x0, y0);
            // var v2 = calcVector(x2, y2, x1, y1);
            // var v3 = calcVector(x0, y0, x1, y1);
            // var angle = Math.acos((Math.pow(v1, 2) + Math.pow(v2, 2) - Math.pow(v3, 2)) / (2 * v1 * v2))
            // angle = (angle * 180 / Math.PI);
            ligne.children[child2].setAttribute("x", x2 - 30);
            ligne.children[child2].setAttribute("y", y2 - 10);
            if (y1 - y2 > 0) {
                ligne.children[child2].setAttribute("transform", "rotate(-" + angle + ", " + x2 + "," + y2 + ")")
            } else {
                ligne.children[child2].setAttribute("transform", "rotate(" + angle + ", " + x2 + "," + y2 + ")")
            }
        }, timer);
    }
    $scope.alertTemp = function () {
        alert("salut");
    }
    $scope.removeLinkBetweenObject = function (id1, id2) {
        console.log(id1 + " " + id2);
        for (var i = 0; i < $scope.linkBetweenObject.length; i++) {
            if ($scope.linkBetweenObject[i].el1 == id1 && $scope.linkBetweenObject[i].el2 == id2) {
                $scope.linkBetweenObject.splice(i, 1);
            } else if ($scope.linkBetweenObject[i].el1 == id2 && $scope.linkBetweenObject[i].el2 == id1) {
                $scope.linkBetweenObject.splice(i, 1);
            }
        }
        console.log($scope.linkBetweenObject);
        $scope.redrawAll();
    }
});
socket.on("infoProject", function (data) {
    angular.element(document.getElementById('view')).scope().setInfo(data);
})
socket.on("PHPObjs", function (data) {
    angular.element(document.getElementById('view')).scope().setPhpObject(data);
})
socket.on("APIObjs", function (data) {
    console.log(data)
    angular.element(document.getElementById('view')).scope().setAPIObject(data);
})


var selectedLine = undefined;
function selectLine(t) {
    if (document.getElementById('selectedLine')) {
        document.getElementById('selectedLine').removeAttribute("id");
    }
    t.setAttribute("id", "selectedLine");
    selectedLine = t.parentNode;
}

$(document).keyup(function (e) {
    console.log(e.which);
    if (e.which == 46 && selectedLine) {
        var id1 = selectedLine.attributes['el1'].value;
        var id2 = selectedLine.attributes['el2'].value;
        selectedLine.parentNode.removeChild(selectedLine);
        angular.element(document.getElementById('view')).scope().removeLinkBetweenObject(id1, id2);
    }
});
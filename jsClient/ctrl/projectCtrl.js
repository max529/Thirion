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
        $timeout(function () {
            $scope.phpObject = res;
        }, 0);
        $timeout(function () {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
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
            if (page == "php") {
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
            socket.emit("savePHP", $scope.phpObject);
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
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        var x1 = t.offsetLeft + Number(t.parentNode.attributes["data-x"].value) + 2.5;
        var y1 = t.offsetTop + Number(t.parentNode.attributes["data-y"].value) + 2.5;
        el.setAttribute("el1", id);
        el.innerHTML = '<line onclick="alertDialog()" x1="' + x1 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="red"/>';
        document.getElementById("objectCont").appendChild(el);
        $compile(el)($scope)
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
            if (t.className == "connectorRight") {
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
            } else if (t.className == "connectorLeft") {
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
                t.parentNode.removeChild(t);
            }
            $scope.currentLine = null;
        }
    }
    $scope.redrawAll = function () {
        for (var i = 0; i < $scope.linkBetweenObject.length; i++) {
            var current = $scope.linkBetweenObject[i];
            var ligne = document.querySelector('svg[el1="' + current.el1 + '"][el2="' + current.el2 + '"]');
            if (ligne == null) {
                ligne = document.querySelector('svg[el1="' + current.el2 + '"][el2="' + current.el1 + '"]');
            }
            $scope.calculatePos(ligne)
            console.log(ligne);
        }
    }
    $scope.calculatePos = function (ligne) {
        //element 1 is the left one
        if(!ligne.attributes["el1"] || !ligne.attributes["el2"]){
            ligne.parentNode.removeChild(ligne);
            return;
        }
        var el1 = ligne.attributes["el1"].value;
        var el2 = ligne.attributes["el2"].value;
        el1 = document.getElementById('object' + el1);
        el2 = document.getElementById('object' + el2);
        // swap if we are wrong
        if (Number(el1.attributes["data-x"].value) > Number(el2.attributes["data-x"].value)) {
            var temp = el1;
            el1 = el2;
            el2 = temp;
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
    }
    $scope.alertTemp = function () {
        alert("salut");
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

function alertDialog() {
    angular.element(document.getElementById('view')).scope().alertTemp();
}
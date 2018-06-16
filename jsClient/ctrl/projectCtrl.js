app.controller('projectCtrl', function ($scope, ajaxHelper, $http, $timeout) {
    $scope.info = {};
    $scope.page = "";
    $scope.idphpObject = -1;
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
        propName: "id"
    }
    $scope.objectSelectPhp = {};


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
            console.log($scope.apiInfo);
            socket.emit("saveAPI", $scope.apiInfo)
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
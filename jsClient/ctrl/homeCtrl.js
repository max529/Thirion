app.controller('homeCtrl', function($scope, ajaxHelper, $http, $timeout) {
    $scope.disks = [];
    $scope.currentPath = projectPath;
    $scope.deep = 0;
    $scope.init = function() {
        angular.element(document.getElementById('nav')).scope().reset();
        projectPath = "";
        $scope.currentPath = "";
        $scope.deep = 0;
        socket.emit("getDisks");
        console.log("demande de disk");
    }
    $scope.setDisks = function(data) {
        $timeout(function() {
            $scope.disks = data;
        }, 0)
    }
    $scope.askPath = function(tar) {
        projectPath += tar + "/";
        $scope.deep++;
        $scope.currentPath = projectPath;
        socket.emit("getChild", projectPath);
    }
    $scope.goPrevious = function() {
        if ($scope.deep == 1) {
            $scope.init();
        } else {
            temp = projectPath.split("/");
            pathTemp = "";
            for (i = 0; i < $scope.deep - 1; i++) {
                pathTemp += temp[i] + "/";
            }
            projectPath = pathTemp;
            $scope.deep--;
            $scope.currentPath = projectPath;
            socket.emit("getChild", projectPath);
        }
    }
    $scope.createProject = function(){
        path = projectPath;
    	socket.emit('setProjectPath', projectPath);
    }
});
socket.on('listDisks', function(data) {
    angular.element(document.getElementById('view')).scope().setDisks(data);
});
socket.on('listChilds', function(data) {
    angular.element(document.getElementById('view')).scope().setDisks(data);
});
socket.on('pathSet', function(data) {
    if(data=="exist"){
        angular.element(document.getElementById('nav')).scope().changeView('project');
    }else if(data=="create"){
        angular.element(document.getElementById('nav')).scope().changeView('create');
    }
});

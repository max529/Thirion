app.controller('createCtrl', function($scope, ajaxHelper, $http, $timeout) {
    $scope.form = {
        name: "application1",
        scss : false,
        materialize : false,
        angular : false,
        php : false,
        api: false,
        db: {
            host: "http://",
            name:"name",
            pass: "pass",
            username: "user"
        }
    }

    $scope.init = function(){
    	angular.element(document.getElementById('nav')).scope().reset();
    	angular.element(document.getElementById('nav')).scope().setValidate(1);
    }

    $scope.validate = function(){
    	console.log($scope.form);
        $("#loader").fadeIn(400);
        socket.emit("createProject",$scope.form);
    }
});
socket.on("projectOnCreation",function(data){
    console.log(data);
    //alert(data);
})
socket.on("projectCreated",function(){
    $("#loader").fadeOut(400);
    angular.element(document.getElementById('nav')).scope().changeView('project');
})

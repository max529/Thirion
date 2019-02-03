app.controller('createCtrl', function ($scope, ajaxHelper, $http, $timeout) {
    $scope.form = {
        name: "application1",
        scss: false,
        materialize: false,
        angular: false,
        php: false,
        nodejs: false,
        api: false,
        db: {
            host: "127.0.0.1",
            name: "test",
            pass: "pass$1234",
            username: "max"
        }
    }

    $scope.init = function () {
        if(path == ''){
            window.location = '/';
        }
        angular.element(document.getElementById('nav')).scope().reset();
        angular.element(document.getElementById('nav')).scope().setValidate(1);
    }

    $scope.validate = function () {
        console.log($scope.form);
        $("#loader").fadeIn(400);
        socket.emit("createProject", $scope.form);
    }

    $scope.revalidateForm = function (from) {
        if (from == 'nodejs' && $scope.form.nodejs) {
            $scope.form.php = false;
        } else if (from == 'php' && $scope.form.php) {
            $scope.form.nodejs = false;
        }
    }
});
socket.on("projectOnCreation", function (data) {
    console.log(data);
    //alert(data);
})
socket.on("projectCreated", function () {
    $("#loader").fadeOut(400);
    angular.element(document.getElementById('nav')).scope().changeView('project');
})

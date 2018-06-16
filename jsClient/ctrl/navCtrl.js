app.controller('navCtrl', function($scope, $location, $timeout) {
    $scope.page = '';
    $scope.changeView = function(p) {

        if (p != $scope.page) {
            $scope.page = p;
            $location.url(p);
            $scope.$apply();
            /*$timeout(function() {
                jQuery('#' + p + 'Nav').click();
            }, 0);*/
            $timeout(function() {
                angular.element(document.getElementById('view')).scope().init();
            }, 100)

            console.log($location.url());

        }
    }
    $scope.init = function() {
        $timeout(function() {
            //$('.modal').modal();
            var a = $location.url();
            a = a.substr(1);
            if (a == "") {
                a = "home";
            }
            $scope.changeView(a);
        }, 0);
    }

    $scope.reset = function(){
        $scope.validate = 0;
    }

    $scope.validate = 0;
    $scope.setValidate = function(i){
        $timeout(function(){
            $scope.validate = i;
        },0);
    }
    $scope.validateClick = function(){
        angular.element(document.getElementById('view')).scope().validate();
    }

});

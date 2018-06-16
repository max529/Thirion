var app = angular.module('projectManager', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', { templateUrl: '/partials/home.html', controller: 'homeCtrl' })
        .when('/create', { templateUrl: '/partials/create.html', controller: 'createCtrl' })
        .when('/project', { templateUrl: '/partials/project.html', controller: 'projectCtrl' })
        .otherwise({ redirectTo: '/' });
});
app.factory('ajaxHelper', function() {
    var factory = {
        user: null,
        transform: function(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        messageRetour: function(message, f, fin) {
            if (fin) {
                document.querySelector("#ajaxLoader").style.visibility = 'hidden';
                document.querySelector("#ajaxLoader").style.opacity = 0;
            }
            if (typeof message === 'string' && message.toLowerCase().indexOf('error') != -1) {
                message = message.split(":")[1];
                document.getElementById('errorMsg').innerHTML = textLangue.messagw[message];
                $('#modalError').modal('open');
            } else if (typeof message === 'string' && message.toLowerCase().indexOf('message') != -1) {
                message = message.split(":")[1];
                document.getElementById('sucessMsg').innerHTML = textLangue.messagw[message];
                $('#modalSuccess').modal('open');
                f(message);
            } else {
                f(message);
            }
        }
    };
    return factory;
})


$(document).ready(function() {
    interact('.object')
        .draggable({
            // enable inertial throwing
            inertia: false,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: false,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function(event) {
                var target = event.target;
                var posArr = Number(target.attributes['posinarray'].value);
                var posX = Number(target.attributes['data-x'].value)
                var posY = Number(target.attributes['data-y'].value)
                angular.element(document.getElementById('view')).scope().setPosition(posArr,posX,posY);
            }
        });
});

 function dragMoveListener(event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // this is used later in the resizing and gesture demos
    window.dragMoveListener = dragMoveListener;

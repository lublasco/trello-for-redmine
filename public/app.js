(function() {
	angular.module('trelloRedmine', ['gridster', 'ui.bootstrap.tpls', 'ui.bootstrap.modal', 'ngRoute', 'ui.sortable', 'ngAnimate', 'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.tooltip'])
		.config(['$routeProvider', '$locationProvider',
			function($routeProvider, $locationProvider) {
				$routeProvider
                    .when('/trello', {
                        templateUrl: 'templates/trello/view.html',
                        controller: 'DashboardCtrl'
                    })
                    .otherwise({
                        redirectTo: '/trello'
                    });

                $locationProvider.html5Mode(true);
            }
        ])
        .controller('RootCtrl', ['$scope', '$http', function($scope, $http) {
            $scope.$on('$locationChangeStart', function(e, next, current) {
                $scope.page = next.split('/').splice(-1);
                if($scope.page) {
                    $scope.styleUrl = 'templates/' + $scope.page + '/style.css';
                }
                $scope.user_id = 'current'; // the one with the api token
                $scope.user_projects = {};
                $scope.user_projects = function (user_id) {
                    $http.get('/users/' + user_id + '/issues').success(function (data) {
                        $scope.user_projects = data;
                    }).error(function (err) {
                        console.log('Fetching user projects error: ' + err);
                    });
                };
                $scope.project_id = 'trello-for-redmine';
                $scope.load_project = function (project_id) {
                    $http.get('/redmine/projects/' + project_id + '/issues').success(function (data) {
                        console.log(data);
                        $scope.current_project = data.project;
                    }).error(function (err) {
                        console.log(err);
                    });
                };

                $scope.load_project($scope.project_id);
            });

            $http.get('/dashboard/load').success(function(data, status) {
                $scope.dashboard = data.dashboard;
            }).error(function(err, status) {
                console.log('error: # ' + status + ', message: ' + err);
            });

        }]);
})();
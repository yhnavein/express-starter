/*global  */
'use strict';

app.controller('UserLoginCtrl', ['$rootScope', '$scope', '$routeParams', '$location',
	function($rootScope, $scope, $routeParams, $location) {

}]);

app.controller('UserSignUpCtrl', ['$rootScope', '$scope', '$routeParams', '$location',
	function($rootScope, $scope, $routeParams, $location) {
		$scope.pswRank = null;

		$scope.$watch('psw', function(newVal, oldVal) {
			if(oldVal === newVal)
				return;

			if(!newVal) {
				$scope.pswRank = null;
				$scope.pswCrackTime = 0;
				return;
			}
			var pswDesc = zxcvbn(newVal);
			$scope.pswRank = pswDesc.score;
			$scope.pswCrackTime = pswDesc.crack_time_display;
		});
}]);
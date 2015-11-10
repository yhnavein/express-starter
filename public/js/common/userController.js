/*global app:false */
'use strict';

app.controller('UserLoginCtrl', ['$rootScope', '$scope', '$routeParams', '$location',
	function($rootScope, $scope, $routeParams, $location) {

}]);

app.controller('UserSignUpCtrl', ['$rootScope', '$scope', '$routeParams', '$location',
	function($rootScope, $scope, $routeParams, $location) {

}]);

app.service('UserService', ['$http', function ($http) {
	return {
		removeAccount: function() {
			$http({ method: 'DELETE', url: '/account' })
				.success(function () {
					window.location = '/';
				}).error(function (data) {
					console.log('Error occured', data);
				});
		}
	};
}]);

app.factory('accRemovalModal', ['vModal', function (vModal) {
  return vModal({
    controller: 'ConfirmAccRemovalCtrl',
    controllerAs: 'ctrl',
    templateUrl: '/views/confirm-acc-removal.html'
  });
}]);

app.controller('ConfirmAccRemovalCtrl', ['accRemovalModal', 'UserService', function (accRemovalModal, UserService) {
  this.close = accRemovalModal.deactivate;

  this.removeAccount = function() {
  	UserService.removeAccount();
  };
}]);

app.controller('UserProfileCtrl', ['$rootScope', '$scope', '$routeParams', 'accRemovalModal',
	function($rootScope, $scope, $routeParams, modal) {
		$scope.pswChange = {};

		$scope.deactivateAccount = function() {
			modal.activate();
		};
}]);

app.controller('UserForgetPswCtrl', ['$rootScope', '$scope', '$routeParams', '$location',
	function($rootScope, $scope, $routeParams, $location) {


}]);

app.controller('UserResetPswCtrl', ['$rootScope', '$scope', '$routeParams', '$location',
	function($rootScope, $scope, $routeParams, $location) {


}]);

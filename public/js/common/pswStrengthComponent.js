/*global zxcvbn:false, app:false */
'use strict';

app.factory('passwordStrengthService', [function () {
  return {
    calculate: function(password) {
      if(!password)
        return null;

      return zxcvbn(password);
    }
  };
}]);

app.directive('passwordStrength', ['passwordStrengthService', function (passwordStrengthService) {
  return {
    template: '<div class="psw-strength psw-rank-{{pswRank}}"><span></span><span></span><span></span><span></span></div>',
    replace: true,
    restrict: 'A',
    scope: {
      value: '=value'
    },
    link: function (scope, iElement, iAttrs) {
      scope.pswRank = null;

      scope.$watch('value', function(newVal, oldVal) {
        if(oldVal === newVal)
          return;

        if(!newVal) {
          scope.pswRank = null;
          scope.pswCrackTime = 0;
          return;
        }
        var pswDesc = passwordStrengthService.calculate(newVal);
        scope.pswRank = pswDesc.score;
        scope.pswCrackTime = pswDesc.crack_time_display;
      });
    }
  };
}]);
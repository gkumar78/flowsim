'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogProfileMatchCtrl
 * @description
 * # DialogProfileMatchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogProfileMatchCtrl', function ($scope, $modalInstance, 
                                                  match) {
    $scope.match = match;

    $scope.ok = function() {
      $modalInstance.close($scope.match);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });

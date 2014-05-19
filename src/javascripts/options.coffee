app = angular.module('TowerOptionsApp', [])
app.controller 'OptionsCtrl', ($scope, $timeout) ->
  initOptions () ->
    $scope.options = options
    $scope.$apply()

    saveOptions = ->
      chrome.storage.sync.set($scope.options)
      $scope.message = '配置已经保存.'
      $timeout (-> $scope.message = null), 2000

    for name of window.options
      $scope.$watch('options.{1}'.assign(name), saveOptions)


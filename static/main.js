(function() {

  'use strict';

  angular.module('WordcountApp', [])

  .controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function($scope, $log, $http, $timeout) {
      $scope.submitButtonText = 'Submit';
      $scope.loading = false;
      $scope.urlerror = false;
      $scope.getResults = function() {
        $log.log("test");

        // get the URL from the input
        var userInput = $scope.url;

        // fire the API request
        $http.post('/start', {
          "url": userInput
        }).
        then(function(response) {
          $log.log(response.data);
          getWordCount(response.data);
          $scope.wordcounts = null;
          $scope.loading = true;
          $scope.submitButtonText = 'Loading...';
        }).
        catch(function(error) {
          $log.log(error);
        });
      };

      function getWordCount(jobID) {
        var timeout = "";
        var poller = function() {
          // fire another request
          $http.get('/results/' + jobID).
          then(function(response) {
            if (response.status === 202) {
              $log.log(response.data, response.status);
            } else if (response.status === 200) {
              $scope.loading = false;
              $scope.urlerror = false;
              $scope.submitButtonText = "Submit";
              $log.log(response.data);
              $scope.wordcounts = response.data;
              $timeout.cancel(timeout);
              return false;
            }
            // continue to call the poller() function every 2 seconds
            // until the timeout is cancelled
            timeout = $timeout(poller, 2000);
          }).catch(function(error){
            $log.log(error);
            $scope.loading = false;
            $scope.submitButtonText = "Submit";
            $scope.urlerror = true;
          });
        };
        poller();
      }
    }

  ]);

}());

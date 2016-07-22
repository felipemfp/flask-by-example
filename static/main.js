(function() {

  'use strict';

  angular.module('WordcountApp', [])

  .controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function($scope, $log, $http, $timeout) {
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
              $log.log(response.data);
              $scope.wordcounts = response.data;
              $timeout.cancel(timeout);
              return false;
            }
            // continue to call the poller() function every 2 seconds
            // until the timeout is cancelled
            timeout = $timeout(poller, 2000);
          });
        };
        poller();
      }
    }

  ]);

}());

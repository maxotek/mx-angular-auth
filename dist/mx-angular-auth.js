/*!
 * See LICENSE in this repository for license information
 */
(function(){
(function () {
    "use strict";

    angular.module("mx-angular-auth", ["mx-angular-api", "ngStorage"]);
})();
"use strict";

(function () {
    angular
        .module("mx-angular-auth")
        .factory("mxngAccountService", mxngAccountService);

    mxngAccountService.$inject = ["$location", "Constants", "$rootScope", "mxngUserService", "$http"];

    function mxngAccountService($location, Constants, $rootScope, mxngUserService, $http) {
        return {
            login: login,
            logout: logout
        };

        function login(account, success, failure) {
            var successWrapper = function (response) {
                mxngUserService.setJwt(response.data);
                $rootScope.onLogin();
                success(response);
            };

            var failureWrapper = function (response) {
                failure(response);
            };

            var obj = {
                "username": account.username,
                "password": account.password
            };
            Object.toparams = function ObjectsToParams(obj) {
                var p = [];
                for (var key in obj) {
                    p.push(key + "=" + encodeURIComponent(obj[key]));
                }
                return p.join("&");
            };
            var req = {
                method: "post",
                url: Constants.tokenUrl,
                data: Object.toparams(obj),
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            };
            $http(req).then(successWrapper, failureWrapper);
        }

        function logout() {
            mxngUserService.currentUser = null;
            mxngUserService.setJwt(null);
            $rootScope.onLogout();
        }
    }
})();
"use strict";

(function () {
    angular
        .module("mx-angular-auth")
        .factory("mxngUserService", mxngUserService);

    mxngUserService.$inject = ["$rootScope", "$localStorage"];

    function mxngUserService($rootScope, $localStorage) {
        var service = {
            currentUser: null,
            accessToken: null,
            setJwt: setJwt,
            saveState: saveState,
            restoreState: restoreState,
            getCurrentUser: getCurrentUser,
            getAccessToken: getAccessToken
        };

        return service;

        function setJwt(token) {
            var user = null;
            if (token != null)
                user = jwt_decode(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

            service.currentUser = user;
            service.accessToken = token;

            service.saveState();
        }

        function saveState() {
            $localStorage.user = angular.toJson(service.currentUser);
            $localStorage.accessToken = angular.toJson(service.accessToken);
        }

        function restoreState() {
            var accessToken = angular.fromJson($localStorage.accessToken);

            if (accessToken) {
                var jwt = jwt_decode(accessToken);

                var now = new Date().getTime();
                var expTime = parseInt(jwt.exp) * 1000;

                if (now >= expTime) {
                    return;
                }
            } else
                return;

            service.currentUser = angular.fromJson($localStorage.user);
            service.accessToken = accessToken;
        }

        function getCurrentUser() {
            service.restoreState();
            return service.currentUser;
        }

        function getAccessToken() {
            service.restoreState();
            return service.accessToken;
        }
    }
})();
})();
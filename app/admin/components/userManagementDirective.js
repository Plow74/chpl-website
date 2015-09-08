;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('UserManagementController', ['adminService', '$log', '$scope', function (adminService, $log, $scope) {
            var self = this;
            self.newUser = {roles: []};
            self.acbId = $scope.acbId;
            self.roles = ['ROLE_ACB_ADMIN','ROLE_ACB_STAFF'];
            if (!self.acbId) {
                self.roles.push('ROLE_ADMIN');
            }

            self.freshenUsers = function () {
                if (self.acbId) {
                    adminService.getUsersAtAcb(self.acbId)
                        .then(function (response) {
                            self.users = response.users;
                        }, function (error) {
                            $log.debug(error);
                        });
                } else {
                    adminService.getUsers()
                        .then(function (response) {
                            self.users = response.users;
                        }, function (error) {
                            $log.debug(error);
                        });
                }
            };
            self.freshenUsers();

            self.createUser = function () {
                if(self.acbId) {
                    var userObject = {acbId: self.acbId,
                                      user: self.newUser,
                                      authority: 'ADMIN'};
                    adminService.addUserToAcb(userObject)
                        .then(function (response) {
                            self.freshenUsers();
                        });
                } else {
                    adminService.createUser(self.newUser)
                        .then(function (response) {
                            self.freshenUsers();
                        })
                }
                $scope.userManagementNewUser.$setPristine();
                $scope.userManagementNewUser.$setUntouched();
                self.newUser = {roles: []};
            };

            self.updateUser = function (user) {
                if (!user.roles)
                    user.roles = [];

                var roleObject = {subjectName: user.user.subjectName};
                for (var i = 0; i < self.roles.length; i++) {
                    var payload = angular.copy(roleObject);
                    payload.role = self.roles[i];
                    if (user.roles.indexOf(self.roles[i]) > -1) {
                        adminService.addRole(payload);
                    } else if (!self.acbId) {
                        adminService.revokeRole(payload);
                    }
                }

                adminService.updateUser(user.user)
                    .then(function (response) {
                        self.freshenUsers();
                    });

            };

            self.deleteUser = function (user) {
                if (self.acbId) {
                    var userObject = {acbId: self.acbId,
                                      userId: user.user.userId};

                    $log.debug(self.users);
                    for (var i = 0; i < self.users.length; i++) {
                        if (self.users[i].user.userId === userObject.userId) {
                            self.users.splice(i,1);
                        }
                    }
                    $log.debug(self.users);

                    adminService.removeUserFromAcb(userObject)
                        .then(function (response) {
                            self.freshenUsers();
                        });
                } else {
                    adminService.deleteUser(user.user.userId)
                        .then(function (response) {
                            self.freshenUsers();
                    });
                }
            };

            self.cancelUser = function (user) {
                $log.info('cancelling changes');
                self.freshenUsers();
            };
        }])
        .directive('aiUserManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/userManagement.html',
                scope: {
                    acbId: '@acbId'
                },
                controllerAs: 'vm',
                controller: 'UserManagementController'
            };
        });
})();

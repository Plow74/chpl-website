;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('CmsController', ['$log', 'commonService', 'authService', 'FileUploader', 'API', function ($log, commonService, authService, FileUploader, API) {
            var vm = this;

            vm.getDownload = getDownload;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.isAcbAdmin = authService.isAcbAdmin();
                vm.isOncStaff = authService.isOncStaff();
                vm.isChplAdmin = authService.isChplAdmin();

            	vm.uploader = new FileUploader({
                    url: API + '/certified_products/meaningful_use_users/upload',
                    removeAfterUpload: true,
                    headers: {
                        Authorization: 'Bearer ' + authService.getToken(),
                        'API-Key': authService.getApiKey()
                    }
            	});
            	
            	if (angular.isUndefined(vm.uploader.filters)) {
                    vm.uploader.filters = [];
                }
                vm.uploader.filters.push({
                    name: 'csvFilter',
                    fn: function(item, options) {
                        var extension = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
                        return '|csv|'.indexOf(extension) !== -1;
                    }
                });
                vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    //$log.info('onSuccessItem', fileItem, response, status, headers);
                	vm.uploadMessage = 'File "' + fileItem.file.name + '" was uploaded successfully. ' + response.meaningfulUseUsers.length + ' certified products out of ' 
                	+ (response.errors.length + response.meaningfulUseUsers.length) + ' were updated with meaningful use user counts.';
                    vm.uploadErrors = response.errors;
                    vm.uploadSuccess = true;
                };
                vm.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    //$log.info...
                };
                vm.uploader.onErrorItem = function(fileItem, response, status, headers) {
                    vm.uploadMessage = 'File "' + fileItem.file.name + '" was not uploaded successfully.';
                    vm.uploadErrors = response.errorMessages;
                    vm.uploadSuccess = false;
                };
                vm.uploader.onCancelItem = function(fileItem, response, status, headers) {
                    //$log.info('onCancelItem', fileItem, response, status, headers);
                };
                vm.filename = 'CMS_IDs_' + new Date().getTime() + '.csv';
                if (authService.isChplAdmin() || authService.isOncStaff()) {
                    vm.csvHeader = ['CMS ID', 'Creation Date', 'CHPL Product(s)'];
                    vm.csvColumnOrder = ['certificationId', 'created', 'products'];
                } else {
                    vm.csvHeader = ['CMS ID', 'Creation Date'];
                    vm.csvColumnOrder = ['certificationId', 'created'];
                }
                vm.isReady = false;
                vm.getDownload();
            }
            
            function getDownload () {
                commonService.getCmsDownload()
                    .then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                            result[i].created = new Date(result[i].created).toISOString().substring(0, 10);
                        }
                        vm.cmsArray = result
                        vm.isReady = true;
                    }, function (error) {
                        $log.debug('error in app.admin.cmsController.getDownload', error);
                    });
            }
            //////////////////////////////////////////////////////////////////// 
        }])
        .directive('aiCmsManagement', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/cms.html',
                scope: {},
                bindToController: {
                    //admin: '='
                },
                controllerAs: 'vm',
                controller: 'CmsController'
            };
        }]);
})();

(() => {
    'use strict';

    fdescribe('the ONC Organization component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            organization: {
                id: 1,
                acbCode: '02',
                name: 'UL LLC',
                website: 'https://industries.ul.com/healthcare',
                address: {
                    addressId: 1,
                    line1: '709 Fiero Lane Suite 25',
                    line2: null,
                    city: 'San Luis Obispo',
                    state: 'CA',
                    zipcode: '93401',
                    country: 'USA',
                },
                retired: false,
                retirementDate: null,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                scope.organization = mock.organization;
                scope.isEditing = false;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-onc-organization organization="organization" type="ONC-ACB" is-editing="isEditing" take-action="takeAction(action, data)"></chpl-onc-organization>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.organization).not.toBe(mock.organization);
                    expect(ctrl.organization).toEqual(mock.organization);
                });
            });

            describe('when using callbacks', () => {
                it('should send back data on edit', () => {
                    ctrl.edit();
                    expect(scope.takeAction).toHaveBeenCalledWith('edit', mock.organization);
                });

                it('should handle save', () => {
                    let savedObject = angular.copy(mock.organization);
                    ctrl.save();
                    expect(scope.takeAction).toHaveBeenCalledWith('save', savedObject);
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                });
            });

            describe('when handling callbacks', () => {
                it('should handle the address', () => {
                    ctrl.organization.address = undefined;
                    ctrl.valid.address = undefined;
                    ctrl.editAddress({city: 'a name'}, [], true);
                    expect(ctrl.organization.address.city).toBe('a name');
                    expect(ctrl.valid.address).toBe(true);
                });
            });
        });
    });
})();
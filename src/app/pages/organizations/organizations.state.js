let states = [
    {
        name: 'organizations',
        abstract: true,
        url: '/organizations',
        component: 'chplOrganizations',
        ncyBreadcrumb: {
            label: 'Organizations',
        },
    },{
        name: 'organizations.developers',
        url: '/developers',
        component: 'chplDevelopers',
        resolve: {
            developers: networkService => {
                'ngInject'
                return networkService.getDevelopers();
            },
        },
        data: { title: 'CHPL Developers' },
    },{
        name: 'organizations.developers.developer',
        url: '/{developerId}',
        component: 'chplDevelopersView',
        resolve: {
            developer: (networkService, $transition$) => {
                'ngInject'
                return networkService.getDeveloper($transition$.params().developerId);
            },
            products: (networkService, $transition$) => {
                'ngInject'
                return networkService.getProductsByDeveloper($transition$.params().developerId);
            },
        },
        data: { title: 'CHPL Developers' },
    },{
        name: 'organizations.developers.developer.split',
        url: '/split',
        component: 'chplDevelopersSplit',
        data: { title: 'CHPL Developers - Split' },
    },{
        name: 'organizations.onc-acbs',
        url: '/onc-acbs',
        component: 'chplOncOrganizations',
        resolve: {
            allOrgs: (authService, networkService) => {
                'ngInject'
                return networkService.getAcbs(false);
            },
            editableOrgs: (authService, networkService) => {
                'ngInject'
                return networkService.getAcbs(true);
            },
            roles: () => ['ROLE_ACB'],
            key: () => 'acbs',
            type: () => 'ONC-ACB',
            functions: () => ({
                get: 'getAcbs',
                getUsers: 'getUsersAtAcb',
                modify: 'modifyACB',
                create: 'createACB',
                removeUser: 'removeUserFromAcb',
            }),
        },
        data: { title: 'CHPL ONC-ACBs' },
        ncyBreadcrumb: {
            label: 'ONC-ACBs',
        },
    },{
        name: 'organizations.onc-acbs.organization',
        url: '/organization/{id}',
        component: 'chplOncOrganization',
        resolve: {
            organization: ($transition$, networkService) => {
                'ngInject'
                return networkService.getAcb($transition$.params().id);
            },
        },
        data: { title: 'CHPL ONC-ACB' },
        ncyBreadcrumb: {
            label: undefined, // must be filled in $onChanges in relevant component
        },
    },{
        name: 'organizations.onc-acbs.organization.edit',
        url: '/edit',
        component: 'chplOncOrganizationEdit',
        data: { title: 'CHPL ONC-ACB' },
        ncyBreadcrumb: {
            label: 'Edit',
        },
    },{
        name: 'organizations.onc-acbs.create',
        url: '/create',
        component: 'chplOncOrganizationEdit',
        data: { title: 'CHPL ONC-ACB' },
        ncyBreadcrumb: {
            label: 'Create',
        },
    },{
        name: 'organizations.onc-atls',
        url: '/onc-atls',
        component: 'chplOncOrganizations',
        resolve: {
            allOrgs: (authService, networkService) => {
                'ngInject'
                return networkService.getAtls(false);
            },
            editableOrgs: (authService, networkService) => {
                'ngInject'
                return networkService.getAtls(true);
            },
            roles: () => ['ROLE_ATL'],
            key: () => 'atls',
            type: () => 'ONC-ATL',
            functions: () => ({
                get: 'getAtls',
                getUsers: 'getUsersAtAtl',
                modify: 'modifyATL',
                create: 'createATL',
                removeUser: 'removeUserFromAtl',
            }),
        },
        data: { title: 'CHPL ONC-ATLs' },
        ncyBreadcrumb: {
            label: 'ONC-ATLs',
        },
    },{
        name: 'organizations.onc-atls.organization',
        url: '/organization/{id}',
        component: 'chplOncOrganization',
        resolve: {
            organization: ($transition$, networkService) => {
                'ngInject'
                return networkService.getAtl($transition$.params().id);
            },
        },
        data: { title: 'CHPL ONC-ATL' },
        ncyBreadcrumb: {
            label: undefined, // must be filled in $onChanges in relevant component
        },
    },{
        name: 'organizations.onc-atls.organization.edit',
        url: '/edit',
        component: 'chplOncOrganizationEdit',
        data: { title: 'CHPL ONC-ATL' },
        ncyBreadcrumb: {
            label: 'Edit',
        },
    },{
        name: 'organizations.onc-atls.create',
        url: '/create',
        component: 'chplOncOrganizationEdit',
        data: { title: 'CHPL ONC-ATL' },
        ncyBreadcrumb: {
            label: 'Create',
        },
    },
];

function organizationsStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { organizationsStatesConfig };

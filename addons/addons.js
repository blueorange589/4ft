
export const addOns = {
  'auth': {
    path: '/auth/:sub?', 
    name: 'auth', 
    routes: {
      'login': {path: '/auth/login', name: 'auth-login'},
      'signup': {path: '/auth/signup', name: 'auth-signup'},
      'forgot': {path: '/auth/forgot', name: 'auth-forgot'},
    }, 
    init: () => {
      //console.log('here')
    },
  },
  'uiKitBuilder': {path:'/addon/uikit/:id?', name: 'addon-uikit', init: () => {}, core: true},
}
  //'admin': {path:'/addon/admin', name: 'addon-uikit', init: () => {}},
  //'user': {path:'/addon/user', name: 'addon-uikit', init: () => {}},
  //


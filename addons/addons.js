
export const addOns = {
  'auth': {
    path: '/auth/:sub?', 
    name: 'auth', 
    routes: {
      'login': {path: '/auth/login', name: 'auth-login', adminMenu: {name: 'Login'}},
      'signup': {path: '/auth/signup', name: 'auth-signup'},
      'forgot': {path: '/auth/forgot', name: 'auth-forgot'},
    }, 
    init: () => {
      //console.log('here')
    },
  },
  'uiKitBuilder': {path:'/addon/uikit/:id?', name: 'addon-uikit', init: () => {}},
  'layoutBuilder': {path:'/addon/layout/:id?', name: 'addon-layout', init: () => {}},
}
  //'admin': {path:'/addon/admin', name: 'addon-uikit', init: () => {}},
  //'user': {path:'/addon/user', name: 'addon-uikit', init: () => {}},
  //


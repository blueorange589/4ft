/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { createApp } = Vue;


import { addOns } from './addons/addons.js';
import { store, getSubdir, makeRoute } from './modules/app/store.js';
import { modal, confirmer, info, divide, card, btn, badge, msg, avatar, filters, sorters, dropdown, paginate } from './modules/app/components/elements.js';
import { home, page, navbar, logo, pagetitle, pagetop,  menulist, mobibar, notFound, unauthorized} from './modules/app/components/layout.js';
import { listItem, listImage } from './modules/app/components/listview.js';
import { tablewrap } from './modules/app/components/table.js';
import { errlist } from './modules/app/helpers/validate.js';
import { ftext, fshow, farea, fselect, fradio, fcheck, fmoney } from './modules/app/components/forms.js';
import { icon } from './modules/app/helpers/icons.js';


const app = createApp({
  setup() {
    const {origin, pathname} =  window.location
    const subdir = getSubdir(pathname)
    store.url.base = origin
    store.url.sub = subdir.slice(-1) === '/' ? subdir.slice(0, -1) : subdir
    return { store }
  }
})


// LAYOUT
app.component('page', page)
app.component('navbar', navbar)
app.component('logo', logo)
app.component('menulist', menulist)
app.component('pagetop', pagetop)
app.component('pagetitle', pagetitle)
app.component('mobibar', mobibar)

// BASE COMPONENTS
app.component('btn', btn)
app.component('badge', badge)
app.component('msg', msg)
app.component('icon', icon)
app.component('modal', modal)
app.component('confirmer', confirmer)
app.component('info', info)
app.component('divide', divide)
app.component('card', card)
app.component('dropdown', dropdown)

app.component('ftext', ftext)
app.component('fshow', fshow)
app.component('farea', farea)
app.component('fselect', fselect)
app.component('fradio', fradio)
app.component('fcheck', fcheck)
app.component('fmoney', fmoney)
app.component('errlist', errlist)

app.component('filters', filters)
app.component('sorters', sorters)
app.component('paginate', paginate)
app.component('listItem', listItem)
app.component('tablewrap', tablewrap)
app.component('ListImage', listImage)


app.component('home', home)




const routes = [
  makeRoute('/', 'site-home', home),
  makeRoute('/page/notfound', 'page-notfound', notFound),
  makeRoute('/page/unauthorized', 'page-unauthorized', unauthorized),
]

Promise.all(
  Object.keys(addOns).map((addOn, index) =>
    import(`./addons/${addOn}/${addOn}.js`),
  ),
).then((modules) => modules.forEach((module) => {
  const {name} = module.container
  const props = addOns[name]
  const rt = makeRoute(props.path, props.name, module.container, props.auth)
  routes.push(rt)
  app.component(`${name}`, module.container)
  if(props.init) props.init()
  return Promise.resolve(true)
})).then(res => {

  const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
  })

  router.beforeEach(async (to, from) => {
    const {me} = store, {meta} = to
    if(meta.reqAuth) {
      if(meta.type) {
        if(me) {
          if(me.role !== meta.type) {
            return { name: 'page-unauthorized' }
          }
        } else {
          store.nextPage = to
          return {name: 'auth-login'}
        }
      }
    }
  })

  app.use(router)
  store.router = router

  app.mount('#app')
})


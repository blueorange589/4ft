/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { createApp, reactive } = Vue;

import { addOns } from "./addons/addons.js";
import { selectRow } from "./dev/scripts/local.js";
import { store, xhr, templates, getSubdir, makeRoute } from "./core/app/store.js";
import {
  modal,
  confirmer,
  info,
  divide,
  card,
  btn,
  badge,
  msg,
  avatar,
  filters,
  sorters,
  dropdown,
  paginate,
} from "./core/app/components/elements.js";
import {
  home,
  page,
  navbar,
  logo,
  pagetitle,
  pagetop,
  menulist,
  mobibar,
  notFound,
  unauthorized,
} from "./core/app/components/layout.js";
import { listItem, listImage } from "./core/app/components/listview.js";
import { tablewrap } from "./core/app/components/table.js";
import { errlist } from "./core/app/helpers/validate.js";
import {
  ftext,
  fshow,
  farea,
  fselect,
  fradio,
  fcheck,
  fmoney,
} from "./core/app/components/forms.js";
import { icon } from "./core/app/helpers/icons.js";

const app = createApp({
  setup() {
    const { origin, pathname } = window.location;
    const subdir = getSubdir(pathname);
    store.url.base = origin;
    store.url.sub = subdir.slice(-1) === "/" ? subdir.slice(0, -1) : subdir;
    return { store };
  },
});

// LAYOUT
app.component("page", page);
app.component("navbar", navbar);
app.component("logo", logo);
app.component("menulist", menulist);
app.component("pagetop", pagetop);
app.component("pagetitle", pagetitle);
app.component("mobibar", mobibar);

// BASE COMPONENTS
app.component("btn", btn);
app.component("badge", badge);
app.component("msg", msg);
app.component("icon", icon);
app.component("modal", modal);
app.component("confirmer", confirmer);
app.component("info", info);
app.component("divide", divide);
app.component("card", card);
app.component("dropdown", dropdown);

app.component("ftext", ftext);
app.component("fshow", fshow);
app.component("farea", farea);
app.component("fselect", fselect);
app.component("fradio", fradio);
app.component("fcheck", fcheck);
app.component("fmoney", fmoney);
app.component("errlist", errlist);

app.component("filters", filters);
app.component("sorters", sorters);
app.component("paginate", paginate);
app.component("listItem", listItem);
app.component("tablewrap", tablewrap);
app.component("ListImage", listImage);

app.component("home", home);

const routes = [
  makeRoute({path: "/", name:"site-home", component:home}),
  makeRoute({path: "/site/notfound", name:"site-notfound", component:notFound}),
  makeRoute({path: "/site/unauthorized", name:"site-unauthorized", component:unauthorized}),
];

const addOnMounts = async() => {
  const ready = await Promise.all(
    Object.keys(addOns).map((addOn, index) =>
      import(`./addons/${addOn}/${addOn}.js`)
    )
  ).then((modules) => {
    const mods = {}
    modules.forEach((mod) => {
      const { name } = mod.container;
      mods[name] = mod
      const initers = addOns[name];
  
      if(initers.core === true) {
        const routeProps = {...initers, ...{component: mod.container}}
        const rt = makeRoute(routeProps);
        routes.push(rt);
        app.component(`${name}`, mod.container);
      } else {
        // register routes
        const subs = initers.routes || {};
        Object.keys(subs).forEach((sk) => {
          const cmp = {template: `<div class="view-${subs[sk].name}">${subs[sk].name}</div>`}
          const routeProps = {...subs[sk], ...{component: cmp}}
          const newrt = makeRoute(routeProps);
          routes.push(newrt)
          console.log(subs[sk])
          app.component(`${subs[sk].name}`, cmp);
        });
        app.component(`${name}`, mod.container);
        // const body = mod.container.setup()
        // bodies[name] = body
      }
      if (initers.init) initers.init();
      
    })
    return mods
  });
  return ready
}




const appMount = async() => {
  const res = await addOnMounts().then(async(mods) => {
    console.log(mods)
    const router = VueRouter.createRouter({
      history: VueRouter.createWebHistory(),
      routes,
    });

    const templates = {}
    const ts = await xhr.database("/query", { run: "select", from: "elements" }).then((res) => {
      res.data.forEach((tmp) => {
        const tn = tmp.name;
        templates[tn] = tmp.template;
      });
    });

    console.log(routes)
    
    router.beforeEach(async (to, from) => {
      const { me } = store,
        { meta } = to;
        console.log(to)
      if (meta.reqAuth) {
        if (meta.type) {
          if (me) {
            if (me.role !== meta.type) {
              return { name: "site-unauthorized" };
            }
          } else {
            store.nextPage = to;
            return { name: "auth-login" };
          }
        }
      }

    
      // const provides = body[name];
      if (to.name === "auth-login") {
        const cmp = app.component('auth')
        const provides = cmp.setup()
        to.matched[0].components.default.setup = () => {
          return provides
        }
    
        // 2 - set route template
        console.log(templates)
        const routeTemplate = templates[to.name]
        to.matched[0].components.default.template = routeTemplate
      }
    })
    
    app.use(router);
    store.router = router;
    
    app.mount("#app");
  })
}
appMount()


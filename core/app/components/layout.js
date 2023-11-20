/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const {reactive} = Vue;
import { store, utils } from '../store.js';
import { twoptions } from '../../../addons/layoutBuilder/twoptions.js';


export const page = {
  setup(props, ctx) {
    const cls = { 'page': true }

    return { store, props, cls }
  },
  props: ["name"],
  template: `<div :class="cls" v-show="store.page==props.name">
  <div class="page-head"><slot name="hdr"></slot></div>
  <div class="page-body"><slot name="default"></slot></div>`
}

export const logo = {
  setup(props) {
    const cls = { 'logo': true }
    const lsz = props.size ? 'logo-' + props.size : 'logo-md'
    cls[lsz] = true
    return { cls, store, utils }
  },
  props: ["text", "src", "dark", "size"],
  template: `<div :class="cls">
  <div v-if="!src" class="row center">
    <icon name="dropbox" color="white" size="xl" class="mr-2"></icon> 
    <span class="self-center whitespace-nowrap text-xl font-semibold">{{text}}</span>
  </div>
  <router-link :to="utils.url.link('/')"><img class="logo-default max-h-7" :src="src" v-if="src"></router-link>
  <router-link :to="utils.url.link('/')"><img class="logo-dark max-h-7" :src="dark" v-if="dark"></router-link>
  </div>`
}

export const navbar = {
  setup() { 
    return { store, utils } 
  },
    template: `<div class="w-full h-9 border-b border-third bg-primary text-white row justify-center">
    <div class="w-full max-w-8xl row between-center py-2">
  <logo text="realis" :src="utils.url.file('assets/logo/logo.svg')" :dark="utils.url.file('assets/logo/logo-dark.svg')"></logo>
  <slot></slot>
  <div class="">
    <btn text="home" bg="coral" size="sm" @click="store.router.push({name:'site-home'})"></btn>
    <btn text="login" bg="coral" size="sm" @click="store.router.push({name: 'auth-login'})" class="mx-2">login</btn>
    <btn text="apps" bg="coral" size="sm" @click="store.router.push({name: 'site-apps'})">apps</btn>
    <btn text="layout" bg="coral" size="sm" @click="store.router.push({name: 'addon-layout'})">layout</btn>
  </div>
  </div>
  </div>`
}

export const menulist = {
  props:['items'],
  setup(props) {
    return { store, props }
  },
  template: `<ul class="menulist">
  <li class="row" v-for="(item,i) in Object.keys(props.items)">
  <router-link :to="{name:item}">{{props.items[item]}}</router-link>
  </li>
  <li class="row">
    <btn icon="cross" text="Logout" size="lg" bg="none" color="primary" @click="ctMain.logout"></btn>
  </li></ul>`
}

export const pagetitle = {
  props: ["text"],
  template:`<div class="pagetitle relative">
      <h3>{{text}}</h3>
      <div class="absolute r-0 t-0">
        <btn icon="sort" bg="none" color="primary" text="Sort"></btn>
        <btn icon="filter" bg="none" color="primary" text="Filter"></btn>
      </div>
      </div>`
}

export const pagetop = {
  props: ["title"],
  template:`<div class="row between-center my-2 border-b border-primary">
      <h3>{{title}}</h3>
      <div>
        <slot></slot>
      </div>
      </div>`
}


export const mobibar = {
  setup(props) {
    return { store }
  },
  template: `<div class="w-full fixed b-0 bg-primary text-white p-2 z-4
  ">
  <div class="row between-center">
    <btn :class="btcls('home')" icon="list" size="lg" bg="nonewhite" @click="store.router.push('home')"></btn>
    <btn :class="btcls('admin-users')" icon="minus" size="lg" bg="nonewhite" @click="store.router.push('admin-users')"></btn>
    <btn class="btn-nav" icon="plus" size="lg" bg="nonewhite" @click="store.router.push('user-resume')"></btn>
    <btn class="btn-nav" icon="share" size="lg" bg="nonewhite" @click="store.router.push('components')"></btn>
    </div></div>`,
  methods: {
    btcls: (pg) => {
      const btcl = { 'btn-nav': true }
      btcl['nav-active'] = (store.page == pg)
      return btcl
    }
  }
}

export const notFound = {
  template: `<div>404:not found</div>`
}

export const unauthorized = {
  template: `<div>You are unauthorized to view this page</div>`
}


export const home2 = {
  setup() {
		const kitNames = []
    const getKits = () => {
      const getKits = localStorage.getItem('uikits')
			const uis = getKits ? JSON.parse(getKits) : false
      if(uis.length) {
        uis.forEach(ui => {
          kitNames.push(ui.kit.name)
        })	
      }
    }
    getKits()
  return { kitNames, store}
  },
  template: `
  <div class="max-w-8xl mx-auto py-4">
  <div class="grid grid-cols-4 gap-4 ">
    <div class="w-full">
      <card>
        <div class="row between-center pb-2">
          <h3>UIKit Builder</h3>
          <div class="row between-center">
            <btn text="create new" icon="plus" size="sm" bg="green" class="mx-1" @click="store.router.push({name:'addon-uikit', params: {id:''}})"></btn>
          </div>
        </div>
        <ul v-if="kitNames.length">
          <li class="py-2 cursor-pointer row between-center" v-for="(kn,idx) in kitNames">
            <div class="font-bold text-lg">{{kn}}</div>
            <div><btn size="md" bg="indigo" text="load" @click="store.router.push({name:'addon-uikit', params: {id: idx}})"></btn></div>
          </li>
        </ul>
        <div v-else>
          <msg color="blue" text="No UIKits found. Click 'create new' to build one."></msg>
        </div>
      </card>
    </div>
  </div></div>`
}


const topEl = document.createElement('div')
topEl.classList.add('lbContainer')

const createEl = (obj) => {
  const el = document.createElement('div')
  let {contains: _, ...props} = obj;
  return el
}

const nodeTraverse = (obj) => {
  const container = createEl(obj)
  const {contains} = obj
  if(contains) {
    Object.keys(contains).forEach(sk => {
      const out = nodeTraverse(contains[sk])
      out.classList.add.apply(out.classList, contains[sk].class)
      out.classList.add('h-12','border')
      out.id = sk
      container.appendChild(out)
    })
  }
  return container
}

const translate = (obj) => {
  Object.keys(obj).forEach((nk) => {
    if(obj[nk].contains) {
      const el = nodeTraverse(obj[nk])
      el.classList.add.apply(el.classList, obj[nk].class)
      el.classList.add('h-12','border')
      el.id = nk
      topEl.appendChild(el)
    } else {
      const el = createEl(obj[nk])
      el.classList.add.apply(el.classList, obj[nk].class)
      el.classList.add('h-12','border')
      el.id = nk
      topEl.appendChild(el)
    }
  })
return topEl
}


const findTraverse = async(obj, nodekey, parentkey) => {
  let res = {node: null, nodeid: null, parentid: null}
  let found = false
  const recurse = (sub, lookId, parentId) => {
    if(!found) {
      Object.keys(sub).forEach(currentId => {
        console.log(currentId, lookId, parentId, found)
        if(currentId == lookId) {
          res.node = sub[currentId]
          res.nodeid = currentId
          res.parentid = parentId
          found = true
        } else {
          if(sub[currentId].contains) {
            let subres = recurse(sub[currentId].contains, lookId, currentId)
            if(subres && subres.node) { res = subres }
          }
        }
      })
    }
    return new Promise(resolve => resolve(res))
  }
  const ret = await recurse(obj, nodekey, parentkey)
  if(ret.node) return ret
return false
}

const rcLayout = reactive({
  selected: {
    id: '',
    classes: []
  },
  tabs: {
    tab: 'display',
    items: {}
  },
  HTML: '',
  data: {
    'def123': {class: ['w-full']},
    'abc123': {
      class: ['w-full', 'flex', 'row'],
      contains: {
        'abc124': {class: ['w-3-12']},
        'abc125': {
          class: ['w-full', 'flex','flex-row'],
          contains: {
            'abc126': { class:['grow-1', 'bg-pink-400'] },
            'abc127': { 
              class:['w-full', 'bg-blue-400'],
              contains: {
                'abc128': {
                  class:['w-full', 'grid', 'grid-cols-3', 'gap-3'],
                  contains: {
                    'abd121': {class: ['bg-indigo-500']},
                    'abd122': {class: ['bg-red-500']},
                    'abd123': {class: ['bg-blue-500']},
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})


const ctLayout = {
  tabs: {
    switch: (tab) => { 
      rcLayout.tabs.tab = tab
      rcLayout.tabs.items = twoptions[tab]
    },
    class: (tab) => { 
      const cls = {"inline p-2 cursor-pointer": true}
      const bg = rcLayout.tabs.tab === tab ? 'bg-secondary font-semibold' : 'bg-primary'
      cls[bg] = true
    return cls
    }
  },
  section: {
    select: (e) => {
      const selected = rcLayout.selected.id
      if(selected) ctLayout.class.remove(selected, 'border-blue-500')
      const {id} = e.target
      const obj = findTraverse(rcLayout.data, id).then(res => {
        rcLayout.selected.id = res.nodeid
        rcLayout.selected.classes = res.node.class
        ctLayout.class.add(res.nodeid, 'border-blue-500')
      })
    }
  },
  class: {
    apply: (e) => {
      alert(e.target.value)
    },
    add: (elid, cls) => {
      const el = document.getElementById(elid)
      el.classList.add(cls)
    },
    remove: (elid, cls) => {
      console.log(elid, cls)
      const el = document.getElementById(elid)
      el.classList.remove(cls)
    }
  }
}








export const home = {
  name: 'layoutBuilder',
  setup() {
    const tabs = Object.keys(twoptions)
    ctLayout.tabs.switch('display')
    rcLayout.HTML = translate(rcLayout.data)

    return {ctLayout, rcLayout, tabs}
  },
  template: `<div class="w-full h-full col">
  <div class="py-2 bg-secondary">
    <div class="max-w-8xl row between-center mx-auto">
      <div class="flex">
        <div>
          <span class="text-white">Page</span>
          <select class="w-32 mx-2">
            <option value="">login</option>
          </select>
        </div>
        <div>
          <span class="text-white">App</span>
          <select class="w-32 mx-2">
            <option value="">jobs</option>
          </select>
        </div>
        <div>
          <span class="text-white">Layout</span>
          <select class="w-32 mx-2">
            <option value="">blog</option>
          </select>
        </div>
        <ul class="row" style="list-style-type: none;">
          <li><a href="javascript:;" class="text-white">Save</a></li>
          <li><a href="javascript:;" class="text-white ml-2">Export</a></li>
        </ul>
      </div>
      
      <ul class="row between-center w-44 p-1">
        <li><a href="#" class="text-white">mobile</a></li>
        <li><a href="#" class="text-white">tablet</a></li>
        <li><a href="#" class="text-white">desktop</a></li>
      </ul>
    </div>
  </div>
  

  <div class="py-4 h-full row justify-center w-full">
    <div class="h-full w-full text-xs max-w-8xl">
      <div class="row text-white">
        <ul class="mb-2">
          <li :class="ctLayout.tabs.class(tab)" @click="ctLayout.tabs.switch(tab)" v-for="tab in tabs">{{tab}}</li>
        </ul>
      </div>
      <div class="p-2 bg-secondary">
        <div class="max-w-8xl row between-center mx-auto text-white row">
          <div class="col m-1" v-for="ik in Object.keys(rcLayout.tabs.items)">
            <span>{{ik}}</span>
            <select class="w-20 text-black" @change="ctLayout.class.apply">
              <option :value="cls" v-for="cls in rcLayout.tabs.items[ik]">{{cls}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="bg-gray px-3">
        <btn bg="green" size="sm" :text="cls" class="mr-2" v-for="cls in rcLayout.selected.classes">{{cls}}</btn>
      </div>
      <div class="bg-gray px-3">
        <btn bg="green" size="sm" text="Add page" class="mr-2"></btn>
        <btn bg="green" size="sm" text="Add section"></btn>
      </div>
      <div class="flex-grow-1 bg-white text-black">
        <div id="layoutContainer">

          
          <!-- const selectSlot = () => {
            loadSlotMenu()
            slot.append(<div class="absolute r-0 b-0">
              <a href="javascript:;" class="text-xl font-bold">+</a>
              <div id="ab2e15" class="bg-white absolute w-24" style="top:25px;right:2px">
                <ul>
                  <li><a href="javascript:;">Section inside</a></li>
                  <li><a href="javascript:;">Element inside</a></li>
                  <li><a href="javascript:;">Add event</a></li>
                  <li><a href="javascript:;">Add data</a></li>
                </ul>
              </div>
            </div>)
            // rm last slotmenu
          } -->
          <div class="lb-section" @click="ctLayout.section.select" v-html="rcLayout.HTML.outerHTML">
          </div>



        </div>
      </div>


    </div>
  </div>
</div>`
}
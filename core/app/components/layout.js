/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
import { store, utils} from '../store.js';


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
    template: `<div class="w-full h-9 p-2 border-b border-third bg-primary text-white row justify-center">
    <div class="w-full max-w-4xl row between-center">
  <logo text="realis" :src="utils.url.file('assets/logo/logo.svg')" :dark="utils.url.file('assets/logo/logo-dark.svg')"></logo>
  <slot></slot>
  <div class="">
    <btn text="home" bg="indigo" @click="store.router.push({name:'site-home'})"></btn>
    <btn text="login" bg="indigo" @click="store.router.push({name: 'auth-login'})" class="mx-2">login</btn>
    <btn text="signup" bg="indigo" @click="store.router.push({name: 'auth-signup'})">signup</btn>
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


export const home = {
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
  template: `<div class="pt-12 pb-32">
  <div class="w-120 mx-auto">
    <div class="row between-center">
      <h2 class="flex-grow-1">UIKit Builder</h2>
      <div class="row between-center">
					<btn text="create new" icon="plus" size="sm" bg="blue" class="mx-1" @click="store.router.push({name:'addon-uikit', params: {id:''}})"></btn>
				</div>
    </div>
    <divide></divide>
    <div class="w-full">
      <card>
        <h3>UIKits</h3>
        <ul v-if="kitNames.length">
          <li class="py-2 cursor-pointer row between-center" v-for="(kn,idx) in kitNames">
            <div class="font-bold text-lg">{{kn}}</div>
            <div><btn size="md" bg="indigo" text="load" @click="store.router.push({name:'addon-uikit', params: {id: idx}})"></btn></div>
          </li>
        </ul>
        <div v-else>
          <msg color="blue" text="No UIKits found. Click create new to build one."></msg>
        </div>
      </card>
    </div>
  </div>
</div>`
}
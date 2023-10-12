/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { reactive } = Vue;

import { config } from '../../config.js'
import { NotifyService } from './components/elements.js'

export const templates = {}

// store.js
export const store = reactive({
  me: false,
  components: {},
  show: { modal: false, login: false },
  nextPage: {},
  modal: { show: false, title: '' },
  confirmer: { title: 'Are you sure?', text: '' },
  info: { text: '' },
  settings: {disableAuth: false},
  pager: { page: 1 },
  url: {
    base: '',
    sub: '',
    full: () => { return [store.url.base, store.url.sub].join('') },
    file: (fn) => { return [store.url.full(),fn].join('/') },
    link: (fn) => { return [store.url.sub,fn].join('') },
    backend: (ep) => { 
      let url = config.dev.backend.local+ep
      if(config.dev.mode === 'production') {
        url = config.dev.backend.production+ep
      }
    return url
    }
  },
  router: {},
  signIn: () => { 
    return new Promise(resolve => setTimeout(resolve, 100, true))
  },
  logout() {
    store.me = null
  },
  unhide(el) { this.show[el] = true },
  hide(el) { this.show[el] = false },
  toggle(el) { this.show[el] = !this.show[el] },
})

export const ctMain = {
  event: (e, obj) => {
    if(e === 'error') { NotifyService.show('error', obj.message) }
    if(e === 'success') { NotifyService.show('success', obj.message) }
  }
}


export const utils = {
  string: {
    ucfirst: (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
  },
  date: {
    now: () => { return new Date() },
    toUnix: (dt) => (dt.getTime() / 1000),
    toISO: (dt) => { return dt.toISOString() },
    format: (dt) => { 
      return dt.toLocaleString(config.locale, 
      { dateStyle: 'short', timeStyle: 'long' })
    },
    nowdate: () => {
      return utils.date.format(utils.date.now())
    }
  },
  random: {
    number: () => { return parseInt(Math.random() * 100) },
    hash: (numChars = 8) => {
      return Math.random().toString(36).substring(0, numChars)
    },
  }
}

export const logger = (input) => {
  const msg = [typeof(input), JSON.stringify(input)].join('|')
  const dt = localStorage.getItem('errors')
  const entries = JSON.parse(dt) || []
  if (entries.length > 10) {
    entries.splice(0, 1)
  }
  entries.unshift(msg)
  const out = JSON.stringify(entries)
  localStorage.setItem('errors', out)
  dbDev.getErrors()
}


export const xhr = {
  options: {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: {}
  },
  request: async (url, opts) => {
    // spinner start
    let o = {...xhr.options, ...opts}
    if (o.method !== 'GET') {
      o.body = ((o.headers['Content-Type'] === 'application/json') ? JSON.stringify(o.body) : o.body)
    }

    const response = await fetch(url, o)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
          return Promise.reject('error 404')
        } else {
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .catch((err) => {console.log(err)})    
    // spinner end

    return new Promise(resolve => resolve(response))
  },
  supabase: async(ep, body) => {
    const url = store.url.backend('/sb'+ep)
    const opts = {body, method: 'POST'}
    const { data, error } = await xhr.request(url, opts)
    return new Promise(resolve => resolve({ data, error }))
  },
  database: async(body) => {
    if(config.dev.database === 'supabase') {
      const res = await xhr.supabase('/query', body)
      console.log(res)
      return res
    }
  }
}



export const getSubdir = (subs) => {
  const parts = subs.split('/')
  if(!parts.length) { return '/' }
  const subdirs = ['admin', 'user', 'dev', 'auth', 'site', 'page']
  const nonrouted = []
  let stop = false
  parts.forEach(part => {
    if(subdirs.includes(part) || stop) { 
      stop = true 
      return 
    }
    nonrouted.push(part)
  })
  return nonrouted.join('/')
}

let id = 1
export const makeRoute = (routeProps) => {
  const {pathname} =  window.location
  const subdir = getSubdir(pathname)
  if(subdir !== '/') { routeProps.path = subdir + path }
  id++
  routeProps.id = id
  return routeProps
}
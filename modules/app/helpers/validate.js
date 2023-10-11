/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
import { logger } from '../store.js'
import { msg } from '../components/elements.js';

// isodate
/*
/((\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])|(0[469]|11)-(0[1-9]|[12]\d|30)|(02)-(0[1-9]|1\d|2[0-8])))T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}([+-]([01]\d|2[0-3]):[0-5]\d|Z)$/
*/

/* username
/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
*/

/* email
 /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
*/

/* password must contain 1 number(0 - 9)
password must contain 1 uppercase letters
password must contain 1 lowercase letters
password must contain 1 non - alpha numeric number
password is 8 - 16 characters with no space */

const check = {
  date: (val,k) => { // yyyy-MM-dd
    const msg = k+": valid date format is yyyy-MM-dd"
    if (/^(19[5-9][0-9]|20[0-4][0-9]|2050)-(0[1-9]|1[0-2])-([1-9]|[12][0-9]|3[01])$/.test(val,k)) {
      return true
    }
    return msg
  },
  isodate: (val,k) => {
    const msg = k+": invalid date"
    if (/^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/.test(val,k)) {
      return true
    }
    return msg
  },
  money: (val,k) => {
    const msg = k+": invalid money format"
    if(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/.test(val,k)) {
      return true
    }
  return msg
  },
  url: (val,k) => {
    const msg = k+": invalid url"
    if( /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(val,k)) {
      return true
    }
  return msg
  },
  lcalpha: (val,k) => {
    const msg = k+": only lowercase (a-z)"
    if(/^[a-z]*$/.test(val,k)) {
      return true
    }
  return msg
  },
  req: (val,k) => {
    const msg = k+": field is required"
    const len = val.length
    if(val && len>0) {
      return true
    }
  return msg
  },
  lensm: (val,k) => {
    const msg = k+": max characters: 16"
    const len = val.length
    if(len<16) {
      return true
    }
  return msg
  },
  lenmd: (val,k) => {
    const msg = k+": max characters: 64"
    const len = val.length
    if(len<64) {
      return true
    }
  return msg
  },
  lenlg: (val,k) => {
    const msg = k+": max characters: 256"
    const len = val.length
    if(len<256) {
      return true
    }
  return msg
  },
  gender: (val,k) => {
    const msg = k+': invalid value for gender'
    if(['male', 'female'].includes(val,k)) {
      return true
    }
  return msg
  },
  email: (val,k) => {
    const msg = k+": invalid email"
    if (/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(val,k)) {
      return true
    }
    return msg
  },
  username: (val,k) => {
    const msg = k+": username must be 6-16 characters,consists only letters and numbers"
    if (/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{1,15}$/.test(val,k)) {
      return true
    }
    return msg
  },
  password: (val,k) => {
    const msg = k+": password must be 8-16 characters with no whitespace"
    if (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/.test(val,k)) {
      return true
    }
    return msg
  }
}

export const validate = (values, rules) => {
  const keys = Object.keys(values)
  const errs = {}
  const elist = []

  keys.forEach((k, idx) => {
    const v = values[k]
    const rs = rules[k]
    
    if(rs && rs.length) {    
      rs.forEach((r, i) => {
        const msg = check[r](v,k)
        console.log(r, msg)
        if (msg !== true) {
          errs[k] = msg
          elist.push(msg)
        }
      })
    }
  })
  return elist.length ? elist.join('<br/>') : true
}

export const errlist = {
  props: ["errdata"],
  template: `<msg color="red" size="md" class="my-4" v-show="errdata.length">
    <ul class="list-disc">
    <li class="pl-2" v-for="(err,i) in errdata">{{err}}</li>
    </ul>
  </msg>`
}
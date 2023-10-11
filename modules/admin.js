/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { reactive } = Vue;

import { query } from '../dev/scripts/local.js';
import {optsRoles} from './app/helpers/options.js';

const str = reactive({
  users: [],
  usersMeta: {
    where: {},
    sorters: {}
  },
  show: {
    filter: false,
    sorter: false,
    unhide: (el) => {
      str.show[el] = true
    }
  }
})

const mtd = {
  getUsers: async () => {
    const {where, sorters} = str.usersMeta
    const q = {
      run: 'select',
      table: 'users',
      where,
      sorters
    }
    
    const res = await query(q)
    str.users = res || []
    return new Promise(resolve => setTimeout(resolve, 101, res));
  },
}



export const usersAdmin = {
  setup() {
    mtd.getUsers({})
    
    const up = (obj) => {
      const n = obj.name
      str.usersMeta.where[n] = obj.value
    }
    
    const f = {
      sort:(opts) => {
        alert(Object.keys(opts))
      },
      filter:() => {
        mtd.getUsers().then(()=>{ f.close() })
      },
      paginate: (page) => {
        alert(page)
        // f.usersMeta.where.page = pager.page
      },
      close:() => { str.show.filter = false }
    }
    
    const optsSort = {'name': 'Name', 'email': 'Email'}
    
    return { str, up, f, optsRoles, optsSort}
  },
  template: `
  <filters @filter="f.filter" @close="f.close" v-show="str.show.filter">
    <ftext name="email" label="Email" @update="up"></ftext>
    <fselect name="role" label="User Type" @update="up" :options="optsRoles"></fselect>
  </filters>
  <pagetop title="Users">
    <sorters :options="optsSort" @sort="f.sort"></sorters>
    <btn size="sm" icon="filter" bg="none" color="primary" text="Filter" @click="str.show.unhide('filter')"></btn>
  </pagetop>
  <card>
  <ul role="list" class="divide-y divide-gray-100">
    <listImage v-for="(u,i) in str.users" :a1="[u.fname,u.lname].join(' ')" :a2="u.role" :b1="u.createdAt" :b2="u.country">
      <avatar :fname="u.fname" :lname="u.lname" :img="u.image||''"></avatar>
    </listImage>
    </ul></card>
    <paginate total="32" @change="f.paginate"></paginate>`
}

export const settingsAdmin = {
  template: `<div>settings admin</div>`
}
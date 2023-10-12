/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
import { store, utils } from './app/store.js';
import { optsGender } from './app/helpers/options.js';
import { updateRow } from '../core/app/helpers/local.js';

const tbl = "users"
const mtd = {
  updateProfile: (dt) => {
    const f = {id: store.me.id}
    updateRow(tbl, f, dt).then(res => {
      if(res) {
        store.me = dt
      }
    })
  }
}

export const profileEditUser = {
  setup() {
    const {me} = store
    
    const up = (obj) => {
      const f = obj.name
      jdb.af[f] = obj.value
    }
    
    // TODO: plus personal info
    const pw = {
      current: '',
      newp: '',
      repeat: '',
      up: () => {
        
      },
      update: () => {
        
      }
    }
    
    return {me,up,pw,mtd,optsGender}
  },
  template: `<card>
  <h3>Edit Profile</h3>
    <div class="grid grid-cols-2 gap-2">
      <ftext name="fname" label="First Name" :value="me.fname" @update="up"></ftext>
      <ftext name="lname" label="Last Name" :value="me.lname" @update="up"></ftext>
    </div>
    <div class="grid grid-cols-2 gap-2 mb-4">
      <fselect name="fname" label="Gender" :value="me.gender" @update="up" :options="optsGender"></fselect>
      <fselect name="country" label="Country" :value="me.country" @update="up" :options="{'US':'United states', 'FR':'France'}"></fselect>
    </div>
    <div class="row end-center py-2">
      <btn size="sm" text="Update" @click="mtd.updateProfile"></btn>
    </div>
        
        
    <h3>Login Information</h3>
    <fshow label="E-mail" :text="me.email"></fshow>
    <divide></divide>
    <b>Update Password</b>
    <div class="grid grid-cols-3 gap-1">
      <ftext type="password" name="password" label="Current Password" :value="pw.current" @update="pw.up"></ftext>
      <ftext type="password" name="password" label="New Password" :value="pw.new" @update="pw.up"></ftext>
      <ftext type="password" name="password" label="New Password (repeat)" :value="pw.repeat" @update="pw.up"></ftext>
    </div>
    <div class="row end-center py-2">
      <btn size="sm" text="Update" @click="pw.update"></btn>
    </div>
  </card>`
}


export const settingsUser = {
  template: `<div>users settings</div>`
}
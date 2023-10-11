/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const fclass = "w-full p-2 border rounded-sm focus:outline-none focus:border-blue hover:shadow"

export const ftext = {
  props: ["name", "label", "placeholder", "value", "type", "size", "inputcls"],
  emits: ["update"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {name: props.name, value: e.target.value}
      emit('update', o)
    }
    const cls = {}
    cls[fclass] = true
    const isz = props.size ? 'input-' + props.size : 'input-md'
    cls[isz] = true
    const extc = props.inputcls
    if (extc) { cls[extc] = true }
    return { cls, changed }
  },
  template: `<div class="field ftext">
  <label class="font-semibold">{{label}}</label>
  <input 
    :name="name"
    :class="cls" 
    :type="type?type:'text'" 
    :placeholder="placeholder" 
    v-model="value" 
    @input="changed" 
    aria-hidden="true">
  </div>`
}

export const fshow = {
  props:["label", "text"],
  template: `<div class="field ftext">
  <label class="font-semibold">{{label}}</label>
  <div class="py-1">{{text}}</div>
  </div>`
}

// v-model modifiers .trim, number, lazy 

export const farea = {
  props: ["name", "label", "rows", "cols", "value"],
  emits: ["update"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {name: props.name, value: e.target.value }
      emit('update', o)
    }
    const cls = {}
    cls[fclass] = true
    return {changed, cls}
  },
  template: `<div class="field farea">
  <label class="font-semibold">{{label}}</label>
  <textarea :class="cls" :rows="rows||10" :cols="cols||30" v-model="value" @input="changed">
  </textarea>
  </div>`
}

export const fselect = {
  props: ["name", "label", "options", "value", "index"],
  emits: ["update"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {name: props.name, value: e.target.value }
      emit('update', o)
    }
    const cls = {}
    cls[fclass] = true
    return {changed, cls}
  },
  template: `<div class="field fselect">
  <label class="font-semibold">{{label}}</label>
  <select :class="cls" @change="changed" v-model="value">
  <option v-for="(val,i) in Object.keys(options)" :value="(index === 'val') ? options[val] : val">{{options[val]}}</option>
  </select>
  </div>`
}

export const fradio = {
  props: ["name", "options"],
  emits: ["update"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {name: props.name, value: e.target.value }
      emit('update', o)
    }
    return {changed}
  },
  template: `<div class="field fradio row start-center" v-for="(val,i) in Object.keys(options)">
  <input type="radio" :name="name" :value="val"  @change="changed"> <span>{{ options[val] }}</span>
  </div>`
}

export const fcheck = {
  props: ["name", "text", "checked"],
  emits: ["update"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {name: props.name, value: e.target.checked }
      emit('update', o)
    }
    return {changed}
  },
  template: `<div class="field fcheck row start-center">
  <input type="checkbox" :name="name" @change="changed" :checked="checked"> 
  <span class="ml-2">{{text}}</span></div>`
}

export const fmoney = {
  props: ["name", "label", "value"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {name: props.name, value: e.target.value }
      emit('update', o)
    }
    return { changed, fclass }
  },
  template: `<div class="field fselect">
  <label class="font-semibold">{{label}}</label>
    
  <div class="relative mt-2 rounded-md shadow-sm row start-center">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
      <span class="text-gray text-lg">$</span>
    </div>
    <input :class="fclass" :placeholder="placeholder" v-model="value" @input="changed" aria-hidden="true">
    <div class="absolute inset-y-0 r-1 flex items-center">
      <label for="currency" class="sr-only">Currency</label>
      <select name="currency" class="h-full rounded-md border-0">
        <option>USD</option>
        <option>CAD</option>
        <option>EUR</option> 
      </select> 
    </div>
 </div>
</div>`
}
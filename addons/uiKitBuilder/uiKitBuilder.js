const { reactive } = Vue;
const { useRoute } = VueRouter;

import { config } from '../../config.js';
import { ctMain, xhr } from '../../core/app/store.js';
import { validate } from '../../core/app/helpers/validate.js';
import { file } from '../../core/app/helpers/file.js';

const getAttributeList = () => {
	return {
		'font-size': {val:'', label: 'Font size', unit: 'rem', group: 'font' }, 
		'font-weight': {val:'', label: 'Font weight', group: 'font' }, 
		'color': {val:'', label: 'Text color', group: 'font' },
		'text-align': {val:'', label: 'Text align', group: 'font' },
		'width': {val:'', label: 'Width', unit: 'rem', group: 'size' },
		'height': {val:'', label: 'Height', unit: 'rem', group: 'size' },
		'display': {val:'', label: 'Display', group: 'size' },
		'position': {val:'', label: 'Position', group: 'size' },
		'border': {val:'', label: 'Border', group: 'border' },
		'border-top': {val:'', label: 'Border top', group: 'border' },
		'border-right': {val:'', label: 'Border right', group: 'border' },
		'border-bottom': {val:'', label: 'Border bottom', group: 'border' },
		'border-left': {val:'', label: 'Border left', group: 'border' },
		'border-color': {val:'', label: 'Border color', group: 'border' },
		'border-radius': {val:'', label: 'Border radius', unit: 'rem', group: 'border' },
		'margin': {val:'', label: 'Margin', unit: 'rem', group: 'spacing' },
		'margin-top': {val:'', label: 'Margin top', unit: 'rem', group: 'spacing' },
		'margin-right': {val:'', label: 'Margin right', unit: 'rem', group: 'spacing' },
		'margin-bottom': {val:'', label: 'Margin bottom', unit: 'rem', group: 'spacing' },
		'margin-left': {val:'', label: 'Margin left', unit: 'rem', group: 'spacing' },
		'padding': {val:'', label: 'Padding', unit: 'rem', group: 'spacing' },
		'padding-top': {val:'', label: 'Padding top', unit: 'rem', group: 'spacing' },
		'padding-right': {val:'', label: 'Padding right', unit: 'rem', group: 'spacing' },
		'padding-bottom': {val:'', label: 'Padding bottom', unit: 'rem', group: 'spacing' },
		'padding-left': {val:'', label: 'Padding left', unit: 'rem', group: 'spacing' },
		'background-color': {val:'', label: 'Background color', group: 'misc' },
	}
}
const getAttributeNames = () => { return Object.keys(getAttributeList()) }
const makeFieldValues = () => {
	const fvals = {}
	const ans = getAttributeNames()
	ans.forEach(an => {
		fvals[an] = ''
	})
return fvals
}

const makeElements = () => {
	return {
		'h1': {tag: 'h1', attrs: getAttributeList(), section: 'heading' }, 
		'h2': {tag: 'h2', attrs: getAttributeList(), section: 'heading' }, 
		'h3': {tag: 'h3', attrs: getAttributeList(), section: 'heading' }, 
		'h4': {tag: 'h4', attrs: getAttributeList(), section: 'heading' }, 
		'h5': {tag: 'h5', attrs: getAttributeList(), section: 'heading' }, 
		'h6': {tag: 'h6', attrs: getAttributeList(), section: 'heading' }, 
		'error': {tag: 'error', attrs: getAttributeList(), section: 'message' }, 
		'warning': {tag: 'warning', attrs: getAttributeList(), section: 'message' }, 
		'success': {tag: 'success', attrs: getAttributeList(), section: 'message' }, 
		'info': {tag: 'info', attrs: getAttributeList(), section: 'message' }
	}
}

const makeColors = () => {
	return {black:'black', white:'white', blue:'blue', green:'green', red:'red', coral:'coral'}
}


const defaultRC = () => {
	return {
		kit: {
			idx: false,
			name: '',
			save: {
				form: {name: ''},
				show: false
			},
			delete: {
				show: false
			},
		},
		sections: ['heading', 'message'],
		els: makeElements(),
		fieldValues: makeFieldValues(),
		colors: makeColors(),
		elements: {
			addsection: {
				form: {name:''},
				show: false
			},
			addelement: {
				form: {section: '', tag: '', name: ''},
				show: false
			}
		},
		pane: {
			title: 'Colors',
			show: true,
			el: '',
			attrs: {},
			group: 'font',
			tab: 'colors'
		},
		tabcolors: {
			addcolor: {
				name: '',
				code: ''
			}
		}
	}
}

let rcStyle = reactive({ui:defaultRC(), list: {}})

const ctStyle = {
	get: {
		elStyles: (el) => {
			const {attrs} = rcStyle.ui.els[el]
			const styles = []
			
			Object.keys(attrs).forEach(attr => {
				const {val,unit} = attrs[attr]
				const u = unit||''
				const txt = `${attr}: ${val}${u}`
				if(val.length) {
					styles.push(txt)
				}
			});
			
			return styles.join(';')
		},
		attributeOptions: (an) => { return attrOptions[an] },
		eo: () => { return rcStyle.ui.els[rcStyle.ui.pane.el]},
		ea: () => { return ctStyle.get.eo().attrs},
		ao: (an) => { return ctStyle.get.ea()[an] },
		eaval: (an) => { return ctStyle.get.ao(an).val },
		kits: async() => {
			const kitList = await xhr.database({run:'select', from: '4ft_uikits', select: ['id', 'name']}).then(res => {
				rcStyle.list = res.data
				return res.data
			})
			return kitList
		}
	},
	load: {
		kit: (kid) => {
			if(kid === 'new') {
				rcStyle.ui = defaultRC()
				ctStyle.get.kits()
			} else {
				xhr.database({run:'select', from:'4ft_uikits', eq: {id: kid}}).then(res => {
					console.log(res.data)
					rcStyle.ui = res.data[0].ui
					// ctStyle.get.kits()
					rcStyle.ui.kit.idx = kid
				})
			}
		}
	},
	click: {
		el: (en) => { 
			rcStyle.ui.pane.el = en
			rcStyle.ui.pane.show = true
			rcStyle.ui.pane.title = 'Attributes: '+en
			ctStyle.click.tab('attributes')

			// els{en: eo:{ tag|section|attrs: { an: ao:{val|label|unit|group}}}}

			const ea = Object.keys(ctStyle.get.ea())
			ea.forEach((an) => {
				rcStyle.ui.fieldValues[an] = ctStyle.get.eaval(an)
			})
		},
		tab: (tn) => {
			const {el} = rcStyle.ui.pane
			if(tn === 'colors') {
				rcStyle.ui.pane.title = "Colors"
			} else {
				rcStyle.ui.pane.title = el ? 'Attributes: '+el : 'Attributes'
			}
			rcStyle.ui.pane.tab = tn
		},
		color: (cn) => {
			rcStyle.ui.tabcolors.addcolor.name = cn
			rcStyle.ui.tabcolors.addcolor.code = rcStyle.ui.colors[cn]
		},
		btn: (evn) => {
			if(evn === 'addsection') { rcStyle.ui.elements.addsection.show = true }
			if(evn === 'addelement') { rcStyle.ui.elements.addelement.show = true }
			if(evn === 'addsectionsubmit') { 
				const {form} = rcStyle.ui.elements.addsection
				const res = validate(form, {name: ['req', 'lcalpha', 'lensm']})
				if(res === true) {
					rcStyle.ui.sections.push(form.name)
					ctMain.event('success', {message: 'added section successfully'})
					ctStyle.event('close', 'modalSection')
					return
				}
				ctMain.event('error', {message: res})
			}
			if(evn === 'addelementsubmit') { 
				const {form} = rcStyle.ui.elements.addelement
				const res = validate(form, {name: ['req', 'lcalpha', 'lensm'], tag: ['req'], section:['req']})
				if(res === true) {
					const {name} = form
					rcStyle.ui.els[name] = {tag:form.tag, section: form.section, attrs: getAttributeList() }
					ctMain.event('success', {message: 'added element successfully'})
					ctStyle.event('close', 'modalElement')
					return
				}
				ctMain.event('error', {message: res})
			}
			if(evn === 'addcolor') { 
				const {name, code} = rcStyle.ui.tabcolors.addcolor
				const res = validate(rcStyle.ui.tabcolors.addcolor, {name: ['req', 'lcalpha', 'lensm'], code: ['req']})
				if(res === true) {
					const k = (code.length) === 6 ? '#'+code : code
					rcStyle.ui.colors[k] = name
					ctMain.event('success', {message: 'added color successfully'})
					rcStyle.ui.tabcolors.addcolor = {name:'', code: ''}
					return
				}
				ctMain.event('error', {message: res})
			}
			if(evn === 'savekit') { 
				if(rcStyle.ui.kit.name.length) {
					const {ui} = rcStyle
					xhr.database({run: 'update', from: '4ft_uikits', data: {ui}, eq: {id: rcStyle.ui.kit.idx}}).then(res => {
						ctMain.event('success', {message: 'saved UIKit successfully'})
					})
				} else {
					rcStyle.ui.kit.save.show = true
				}
			}
			if(evn === 'savekitsubmit') {
				const {name} = rcStyle.ui.kit.save.form
				const check = validate(rcStyle.ui.kit.save.form, {name: ['req', 'lcalpha', 'lensm']})
				if(check === true) {
					ctStyle.event('close', 'modalSaveKit')
					rcStyle.ui.kit.name = name
					const {ui} = rcStyle.ui
					xhr.database({run: 'insert', from: '4ft_uikits', data: {name, ui}}).then(res => {
						ctMain.event('success', {message: 'saved UIKit successfully'})
						ctStyle.get.kits().then(r => {
							rcStyle.ui.kit.idx = (res.length-1)
							console.log(rcStyle.list)
						})
					})
				}
				ctMain.event('error', {message: check})
			}
			if(evn === 'deletekit') {
				if(rcStyle.ui.kit.idx === false) return false
				rcStyle.ui.kit.delete.show = true
			}
			if(evn === 'deletekitsubmit') {
				const {idx} = rcStyle.ui.kit
				xhr.database({run:'delete', from:'4ft_uikits', eq: {id: idx}}).then(res => {
					if(res) {
						ctMain.event('success', {message: 'deleted UIKit successfully'})
						ctStyle.event('close', 'modalDeleteKit')
						ctStyle.get.kits()
					}
				})
			}
			if(evn === 'exportkit') {
				if(config.mode === 'demo') {
					ctMain.event('error', {message: 'Demo site: CSS exports are not allowed'})
					return false
				}
				const ens = Object.keys(rcStyle.ui.els)
				const outs =[]
				ens.forEach(en => {
					const styles = ctStyle.get.elStyles(en)
					const out = `.${en} {${styles}}\n`
					outs.push(out)
				})
				const css = outs.join('\n')
				file.export.text(css, 'text/css', '4ft.css')
			}
		}
	},
	event: (e, name) => {
		if(e === 'close') {
			if(name === 'modalSection') { rcStyle.ui.elements.addsection.show = false }
			if(name === 'modalElement') { rcStyle.ui.elements.addelement.show = false }
			if(name === 'modalSaveKit') { rcStyle.ui.kit.save.show = false }
			if(name === 'modalDeleteKit') { rcStyle.ui.kit.delete.show = false }
		}
	}
}





const listTags = ['article', 'blockquote', 'body', 'break', 'button', 'caption', 'canvas', 'center', 'code', 'div', 'embed', 'fieldset', 'footer', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'input', 'label', 'li', 'main', 'nav', 'option', 'p', 'section', 'span', 'strong', 'svg', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td']
const sizes = []
const pxsizes = []
const fontWeights = []
const textAligns = ['left', 'center', 'right']
const directions = ['', 'top', 'right', 'bottom', 'left']
const positions = ['relative', 'absolute', 'fixed', 'static']
const formats = ['inline', 'block', 'contents', 'flex', 'grid', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table', 'table', 'none', 'initial', 'inherit']

const borders = {
	widths: pxsizes,
	colors: Object.keys(rcStyle.ui.colors),
	styles: ['solid', 'dotted', 'dashed']
}


for(let i=1;i<120;i++) {
	if(i<25) { pxsizes.push(i) }
	if(i<10) { 
		const f = i * 100
		fontWeights.unshift(f)
	}
	if(i>32) {
		if(i % 4 === 0) {
			const s = 0.125 * i
			sizes.push(s)
		}
	} else {
		const s = 0.125 * i
		sizes.push(s)
	}
}


const bVals = []
const mkBorderOpts = (i) => {
	const types = ['solid', 'dotted', 'dashed']
	types.forEach(t => {
		const v = `${i}px ${t}`
		bVals.push(v)
	})
}


for(let i = 1;i<5;i++) {
	const vals = mkBorderOpts(i)
}

const attrOptions = {
	'font-size': sizes, 
	'font-weight': fontWeights, 
	'color': Object.keys(rcStyle.ui.colors),
	'text-align': textAligns,
	'width': sizes,
	'height': sizes,
	'display': formats,
	'position': positions,
	'background-color': Object.keys(rcStyle.ui.colors),
	'border': bVals,
	'border-top': bVals,
	'border-right': bVals,
	'border-bottom': bVals,
	'border-left': bVals,
	'border-color': Object.keys(rcStyle.ui.colors),
	'border-radius': sizes,
	'margin': sizes,
	'margin-top': sizes,
	'margin-right': sizes,
	'margin-bottom': sizes,
	'margin-left': sizes,
	'padding': sizes,
	'padding-top': sizes,
	'padding-right': sizes,
	'padding-bottom': sizes,
	'padding-left': sizes,
}

const inputCls = "text-black border border-gray-700 rounded-sm bg-white w-16 text-right px-2 flex-grow-1"
const tabcolors = {
	setup() {
		return {inputCls, rcStyle, ctStyle}
	},
	methods: {
		colorTag: (cc) => { 
			return `background-color: ${cc};`
		}
	},
	template:`<div>
	<div class="row start-center pb-4">
		<div class="row between-end mr-4">
			<div class="col w-24">
				<label>Name</label>
				<input name="name" :class="inputCls" v-model="rcStyle.ui.tabcolors.addcolor.name">
			</div>
			<div class="col w-24 mr-4">
				<label>Color code</label>
				<div class="row">
					<input name="code" :class="inputCls" v-model="rcStyle.ui.tabcolors.addcolor.code">
					<label class="text-xxs">HEX</label>
				</div>
			</div>
			<btn text="Add color" @click="ctStyle.click.btn('addcolor')"></btn>
		</div>
		<div class="flex-grow-1 row start-center border-l pl-4 flex-wrap">
			<div class="col cursor-pointer" 
				@click="ctStyle.click.color(cn)"
				v-for="cc in Object.keys(rcStyle.ui.colors)">
					{{rcStyle.ui.colors[cc]}}
				<span class="mr-4 px-2 text-white" :style="colorTag(cc)">{{cc}}</span>
			</div>
		</div>
	</div>
</div>`
}


const frow = {
  props: ["an", "label", "value", "options", "unit"],
  emits: ["update"],
  setup(props, { emit }) {
    const changed = (e) => {
      const o = {an: props.an, value: e.target.value, unit: props.unit}
      emit('update', o)
    }
    return { changed, rcStyle }
  },
	methods: {
		attrInGroup: (an) => {
			return (rcStyle.ui.pane.group === ctStyle.get.ao(an).group)
		},
		fieldValue: (an) => {
			const ea = ctStyle.get.ao(an)
		return ea.val
		}
	},
	template: `<div class="w-36 col m-2 border-b border-gray-100" v-if="attrInGroup(an)" >
  <label style="font-size:.8rem;font-weight:500;">{{label}}</label>
	<div class="row between-center">
	<select :attr="an" v-model="value" @change="changed" class="text-black border border-gray-700 rounded-sm bg-white w-12 text-right px-2 flex-grow-1">
		<option v-for="o in options" :value="o">{{o}}</option>
	</select>
	<span class="block pl-1">{{unit}}</span>
	</div>
  </div>`
}

const pane = {
	components:{frow,tabcolors},
	setup() {
		const up = (obj) => {
			const {an} = obj
			ctStyle.get.ao(an).val = obj.value
		}
		const getTabcls = (el) => {
			const tabcls = {"w-24 text-center font-bold p-2 rounded-t cursor-pointer": true}
			if(rcStyle.ui.pane.tab === el) {
				tabcls['bg-gray'] = true
			} else {
				tabcls['bg-indigo'] = true
			}
		return tabcls
		}
		return {rcStyle, ctStyle, up, getTabcls, getAttributeList}
	},
	methods: {
		getOptions: (an) => {
			if(['color', 'border-color', 'background-color'].includes(an)) return Object.keys(rcStyle.ui.colors)
			return attrOptions[an]
		}
	},
	template: `<div>
	<div id="pane-tabs" class="row text-white pl-4">
		<div :class="getTabcls('attributes')" class="mr-2" @click="ctStyle.click.tab('attributes')">Attributes</div>
		<div :class="getTabcls('colors')" @click="ctStyle.click.tab('colors')">Colors</div>
	</div>
	<div id="pane-body" class="w-full mb-4 bg-gray rounded p-2 text-white">
		<div id="pane-header" class="row between-center">
			<h3 class="flex-grow-1 text-white">{{rcStyle.ui.pane.title}}</h3>
			<div class="row between-center">
				<a href="#" class="bg-white p-1" @click="rcStyle.ui.pane.show=false" v-if="rcStyle.ui.pane.show">Collapse</a>
				<a href="#" class="bg-white p-1" @click="rcStyle.ui.pane.show=true" v-else>Expand</a>
			</div>
		</div>
		<div id="pane-content" v-if="rcStyle.ui.pane.show">
			<div v-if="rcStyle.ui.pane.tab==='attributes'">
				<div v-if="rcStyle.ui.pane.el">
					<div>
						<btn class="rounded-none" size="sm" text="fonts" bg="pink" @click="rcStyle.ui.pane.group='font'"></btn>
						<btn class="rounded-none" size="sm" text="sizes" bg="pink" @click="rcStyle.ui.pane.group='size'"></btn>
						<btn class="rounded-none" size="sm" text="borders" bg="pink" @click="rcStyle.ui.pane.group='border'"></btn>
						<btn class="rounded-none" size="sm" text="spacing" bg="pink" @click="rcStyle.ui.pane.group='spacing'"></btn>
						<btn class="rounded-none" size="sm" text="misc" bg="pink" @click="rcStyle.ui.pane.group='misc'"></btn>
					</div>
					<div class="grid grid-cols-5 gap-2 m-2 border-t">
						<frow 
							:an="an" 
							:options="getOptions(an)" 
							:unit="ctStyle.get.ao(an).unit || ''" 
							:label="ctStyle.get.ao(an).label" 
							:value="rcStyle.ui.fieldValues[an]" 
							v-for="an in Object.keys(getAttributeList())"
							@update="up" 
						>
						</frow>
					</div>
				</div>
				<msg v-else>Pick an element to start editing</msg>
			</div>
			<tabcolors v-else-if="rcStyle.ui.pane.tab==='colors'"></tabcolors>
		</div>
	</div>
</div>`
}

const uisection = {
	props: ['title'],
	template: `<div>
		<div class="uisectiontitle w-full font-semibold pb-2 border-b border-gray-100">{{title}}</div>
		<slot></slot>
	</div>`
}

const preview = {
	components:{uisection},
	setup() {
		return {ctStyle,rcStyle}
	},
	methods: {
		getTag: (en) => {
			const el = rcStyle.ui.els[en]
			const st = ctStyle.get.elStyles(en)
			return `<${el.tag} style="${st}">sample text (${en})</${el.tag}>`
		},
		inSection: (en, sec) => {
			const el = rcStyle.ui.els[en]
			if(!el.section) return false
			return (el.section === sec)
		}
	},
	template: `<card>
		<h3 class="flex-grow-1">Preview: UI Kit</h3>
		<divide></divide>
		<div class="uipreview grid grid-cols-3 gap-3">
			<uisection :title="sec" v-for="sec in rcStyle.ui.sections">
				<div v-for="en in Object.keys(rcStyle.ui.els)" class="uielement py-1">
					<span v-if="inSection(en, sec)" v-html="getTag(en)"></span>
				</div>
			</uisection>
		</div>
	</card>`
}


const elements = {
	setup() {
		const up = (obj) => { rcStyle.ui.elements.addsection.form.name = obj.value }
		const upel = (obj) => { rcStyle.ui.elements.addelement.form[obj.name] = obj.value }

		return {up, upel, rcStyle, ctStyle, listTags}
	},
	methods: {
		inSection: (en, sec) => {
			const el = rcStyle.ui.els[en]
			if(!el.section) return false
			return (el.section === sec)
		}
	},
	template: `
	<modal bg="gray-300" title="add section" v-show="rcStyle.ui.elements.addsection.show" @close="ctStyle.event('close','modalSection')">
		<ftext name="name" label="name" :value="rcStyle.ui.elements.addsection.form.name" @update="up"></ftext>
		<template #ftr>
			<btn size="sm" text="add" @click="ctStyle.click.btn('addsectionsubmit')"></btn>
		</template>
	</modal>
	<modal bg="gray-300" title="add element" v-show="rcStyle.ui.elements.addelement.show" @close="ctStyle.event('close','modalElement')">
		<fselect name="section" label="section" :options="rcStyle.ui.sections" index="val" :value="rcStyle.ui.elements.addelement.form.section" @update="upel"></fselect>
		<fselect name="tag" label="HTML tag" :options="listTags" index="val" :value="rcStyle.ui.elements.addelement.form.tag" @update="upel"></fselect>
		<ftext name="name" label="name" :value="rcStyle.ui.elements.addelement.form.name" @update="upel"></ftext>
		<template #ftr>
			<btn size="sm" text="add" @click="ctStyle.click.btn('addelementsubmit')"></btn>
		</template>
	</modal>
	<div class="w-36">
	<btn text="add section" size="sm" class="mt-0 w-full" @click="ctStyle.click.btn('addsection')"></btn>
	<btn text="add element" size="sm" class="w-full" @click="ctStyle.click.btn('addelement')"></btn>
	<card v-for="sec in rcStyle.ui.sections" class="my-2">
		<div class="font-bold text-black border-b">{{sec}}</div>
		<span 
			v-for="en in Object.keys(rcStyle.ui.els)" 
			@click="ctStyle.click.el(en)">
			<span class="block font-semibold border-b py-1 cursor-pointer" v-if="inSection(en,sec)">{{en}}</span>
		</span>
	</card>
</div>`
}

export const container = {
	name: 'uiKitBuilder',
	components: {elements, pane, preview},
	setup(props) {
		const route = useRoute()
		const upad = (obj) => { rcStyle.ui.kit.save.form.name = obj.value }

		const loadKit = (idx) => { console.log(idx); ctStyle.load.kit(idx) }
		const kitChange = (e) => { loadKit(e.target.value) }

		if(route.params.id) {
			ctStyle.load.kit(route.params.id)
		} else {
			ctStyle.load.kit('new')
		}

		ctStyle.get.kits()

		return {upad, rcStyle, ctStyle, kitChange}
	},
	template: `<modal bg="gray-300" title="save UIKit" v-show="rcStyle.ui.kit.save.show" @close="ctStyle.event('close','modalSaveKit')">
		<ftext name="name" label="name" :value="rcStyle.ui.kit.save.name" @update="upad"></ftext>
		<template #ftr>
			<btn size="sm" text="save" @click="ctStyle.click.btn('savekitsubmit')"></btn>
		</template>
	</modal>
	<modal bg="gray-300" title="delete UIKit" v-show="rcStyle.ui.kit.delete.show" @close="ctStyle.event('close','modalDeleteKit')">
		<span>Are you sure?</span>
		<template #ftr>
			<div class="w-full row between-center">
				<btn size="sm" text="cancel" bg="gray" @click="ctStyle.event('close', 'modalDeleteKit')"></btn>
				<btn size="sm" text="delete" bg="red" @click="ctStyle.click.btn('deletekitsubmit')"></btn>
			</div>
		</template>
	</modal>
	<div class="bg-black pt-12 pb-32">
		<div class="max-w-8xl mx-auto">
			<div class="row between-center">
				<h2 class="flex-grow-1 text-white">UIKit Builder</h2>
				<div class="row between-center">
					<span class="text-white">Load Kit:</span>
					<select class="w-48 py-1 mx-1" @change="kitChange" v-model="rcStyle.ui.kit.idx">
						<option value="new" selected>-- New UIKit --</option>
						<option v-for="(kit, i) in rcStyle.list" :value="kit.id">{{kit.name}}</option>
					</select>
					<btn text="Save" size="sm" bg="blue" class="mx-1" @click="ctStyle.click.btn('savekit')"></btn>
					<btn text="Export" size="sm" bg="pink" class="mx-1" @click="ctStyle.click.btn('exportkit')"></btn>
					<btn text="Delete" size="sm" bg="gray" class="ml-1" @click="ctStyle.click.btn('deletekit')"></btn>
				</div>
			</div>
			<divide></divide>
			<div class="row between-start h-full">
					<elements></elements>
					<div class="w-full pl-4">
						<pane></pane>
						<preview></preview>
					</div>
			</div>
		</div>
	</div>`
}
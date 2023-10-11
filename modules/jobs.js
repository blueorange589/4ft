/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { reactive, ref, watch } = Vue;
const { useRouter, useRoute } = VueRouter;

import { store, utils } from './app/store.js';
import { optsGender, optsJobLink, optsJobTypes } from './app/helpers/options.js';
import { validate } from './app/helpers/validate.js';
import { query, insertRow, selectAt, selectRow, selectRows, selectAll, truncate } from '../dev/scripts/local.js';
import { cvs } from '../dev/data/samples.js';

const jt = 'jobs'
const sampleAdd = () => {
  return { category: '', company:'Rivalo', title: 'Fullstack Developer', type: 'full', remote: false, city: 'New york', country: 'USA', salary: '88.000', currency: 'USD', link: 'external', url: 'https://finpose.com', descr: 'As a fullstack developer, your role is to \n - develop clean code \n - build unit tests', featured: true }
}
const defaultAdd = () => {
  return { category:'', company:'', title: '', type: 'full', remote: false, city: '', country: '', salary: '', currency: 'USD', link: 'internal', url: '', descr: '', featured: false }
}
const rulesAdd = { title: '', remote: '', city: '', country: '', salary: '', currency: '', url: ['url'], descr: '' }

const sampleResume = () => {
  return cvs[0]
}
const defaultResume = () => {
  return { fname: '', lname:'', title: '', gender:'', nationality:'', email: '', phone: '', social: { linkedin: '' }, website: '', statement: '', 
  exp: [{ title: '', company: '', from: '', to: '', achieves: [] }], 
  edu: [{ ins: '', study: '', degree: '', grad: '' }], 
  skills: [{ skill: '', level: '' }], 
  langs: [{ lang: '', level: '' }],
  certs:[{ name:'', ins:''}],
  courses:[{ name:'', ins:'', completedAt:''}]
  }
}
const rulesResume = { fname: '', lname: '', birthdate: ['date'], gender: ['gender'], edu: [] }
const defaultApply = () => {
  return {userid:'', company:'', jobid:'', cv: {}, cletter: ''}
}

const rcJobs = reactive({
  add: sampleAdd(),
  currencies: { 'USD': 'USD', 'EUR': 'EUR', 'CAD': 'CAD', 'JPY': 'JPY' },
  jobs: [],
  job: {},
  categories: [],
  catOptions: [],
  errors: {},
  rf: sampleResume(),
  af: defaultApply(),
  usercv: {},
  userapps:[],
  adminapps:[],
  companies:[],
  form: {
    addCategory: { name: '', slug: '', descr: '' }
  },
  show: { addCategory: false },
})

export const dbJobs = {
  getJobs: async (qobj) => {
    const res = await query(qobj)
    return new Promise(resolve => setTimeout(resolve, 100, res))
  },
  getJob: async (idx) => {
    const res = await selectAt(jt, idx)
    rcJobs.job = res
    return new Promise(resolve => setTimeout(resolve, 100, res))
  },
  getCategories: async(q) => {
    const res = await query(q)
    return new Promise(resolve => setTimeout(resolve, 100, res))
  },
  addJob: async () => {
    rcJobs.add.id = utils.random.number()
    const res = await insertRow(jt, rcJobs.add)
    const q = {'from': jt}
    if (res) dbJobs.getJobs(q)
    return new Promise(resolve => setTimeout(resolve, 100, res))
  },
  getCompanies: async () => {
    const res = await selectAll('companies')
    rcJobs.companies = res
  },
  addCompany: async () => {
    rcJobs.cf.id = utils.random.number()
    const res = await insertRow('companies', rcJobs.cf)
    if (res) dbJobs.getCompanies()
  },
  addResume: async () => {
    rcJobs.rf.id = utils.random.number()
    const res = await insertRow('resume', rcJobs.rf)
    return new Promise(resolve => setTimeout(resolve, 100, res))
  },
  getUserResume: async (userid) => {
    const res = await selectRow('resume', 'userid', userid)
    return res
  },
  addApplication: async (app) => {
    const res = await insertRow('applications', app)
    return new Promise(resolve => setTimeout(resolve, 100, res))
  },
  getAdminApplications: async () => {
    const res = await selectAll('applications')
    rcJobs.adminapps = res
  return res
  },
  getUserApplications: async (uid) => {
    alert(uid)
    const f = {'userid': uid}
    const res = await selectRows('applications', f)
    alert(res)
    rcJobs.userapps = res
    return res
  },
  flush: async () => {
    const res = await truncate(jt)
    if (res) dbJobs.getJobs()
  }
}

export const jobs = {
  setup() {
    const router = useRouter()

    const loadJob = (idx) => {
      dbJobs.getJob(idx).then(res => {
        router.push({name:'job', params:{id:idx}})
      })
    }
    
    const f = reactive({
      q: {run:'select', from:jt, eq:{}},
      jobs: [],
      show: {
        filter: false,
        sorter: false,
        unhide: (el) => {
          str.show[el] = true
        }
      },
      sort: (opts) => {
        alert(Object.keys(opts))
      },
      filter: () => {
        dbJobs.getJobs(f.q).then((res) => { 
          f.jobs = res
        })
      },
      paginate: (page) => {
        alert(page)
        // f.usersMeta.where.page = pager.page
      },
      unhide: (el) => { f.show[el] = true },
      close: (el) => { f.show[el] = false }
    })
    
    watch(
      () => f.q,
      (query) => {
        dbJobs.getJobs(query).then((res) => {
          f.jobs = res
        })
      }
    )
    
    const up = (obj) => {
      const n = obj.name
      if(n==='title') { 
        f.q.like[n] = obj.value 
        return
      }
      
      f.q.eq[n] = obj.value
    }
    
    const optsSort = { 'name': 'Name', 'type': 'Type' }
    
    f.filter()
    
    return { rcJobs, f, loadJob, optsJobTypes, optsSort, store, dbJobs, up }
  },
  template: `
  <filters @filter="f.filter" @close="f.close('filter')" v-show="f.show.filter">
  <ftext name="title" label="Job title" @update="up"></ftext>
  <fselect name="type" label="Job Type" @update="up" :options="optsJobTypes"></fselect>
  <fcheck name="remote" text="Remote" @update="up"></fcheck>
  </filters>
  <pagetop title="Jobs">
    <sorters :options="optsSort" @sort="f.sort"></sorters>
    <btn size="sm" icon="filter" bg="none" color="primary" text="Filter" @click="f.unhide('filter')"></btn>
  </pagetop>
  <card class="cursor-pointer my-4" :color="j.featured?'yellow':'white'" v-for="(j,i) in f.jobs" @click="loadJob(i)">
      <div class="row between-center">
        <div class="w-12">
          <img class="w-12" :src="store.url.file('/dev/assets/img/logoicon1.svg')"/>
        </div>
        <div class="w-full pl-2">
          <div class="row between-center">
            <h3 class="text-md">{{j.title}}</h3>
            <span>21 Jun</span>
          </div>
          <div class="row between-center">
            <div class="w-full">{{optsJobTypes[j.type]}}</div>
            <div class="row end-center w-16">
              <badge text="Remote" size="sm" color="pink" v-if="j.remote"></badge>
              <span v-else>{{j.city}} / {{j.country}}</span>
              <icon size="sm" name="map"></icon>
            </div>   
          </div>
        </div>
      </div>
      <div class="my-2">{{j.descr}}</div>
    </card>`
}

const jobinfo = {
  setup() {
    return {optsJobTypes, rcJobs}
  },
  template: `
  <div class="row">
    <div>Company</div>
    <div>{{rcJobs.job.company}}</div>
  </div>
  <div class="row">
    <div>Job Type</div>
    <div>{{optsJobTypes[rcJobs.job.type]}}</div>
  </div>
  <div class="row">
    <div>Location</div>
    <span v-if="rcJobs.job.remote">Remote</span>
    <div v-else>{{rcJobs.job.city+'/'+rcJobs.job.country}}</div>
  </div>
  <div class="row">
    <div>Salary</div>
    <div>{{rcJobs.job.salary}} {{rcJobs.job.currency}}</div>
  </div>`
}

export const job = {
  components: {jobinfo},
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const idx = route.params.id
    const loadJob = () => {
      dbJobs.getJob(idx).then(res => {
        router.push({ name: 'user-apply', params: { id:idx } })
      })
    }
    return { store, rcJobs, loadJob }
  },
  template: `<card class="display-data" :title="rcJobs.job.title">
  <jobinfo></jobinfo>
  <divide></divide>
  <div class="col">
    <b>Description</b>
    <div class="py-2">{{rcJobs.job.descr}}</div>
  </div>
  </card>
  <div class="row end-center py-2">
  <btn icon="link" size="lg" text="Apply" v-if="rcJobs.job.external"></btn>
  <btn icon="pencil" size="md" text="Apply" @click="loadJob" v-else></btn>
  </div>`
}

export const apply = {
  components: {jobinfo},
  setup() {
    const router = useRouter()
    const up = (obj) => {
      const f = obj.name
      rcJobs.af[f] = obj.value
    }
    const goto = (pg) => {
      router.push(pg)
    }
    const applySubmit = () => {
      dbJobs.addApplication(rcJobs.af).then(res => {
        alert('success')
        goto({name: 'site-home'})
      })
    }
    dbJobs.getUserResume(store.me.id).then(res => {
      rcJobs.usercv = res || {}
      rcJobs.af.userid = store.me.id
      rcJobs.af.company = rcJobs.job.company
      rcJobs.af.jobid = rcJobs.job.id
      rcJobs.af.cv = res || {}
    })
    
    return { rcJobs, goto, up, applySubmit }
  },
  template: `<card class="display-data" title="Apply for position">
  <div class="row">
    <div>Job Title</div>
    <div>{{rcJobs.job.title}}</div>
  </div>
  <jobinfo></jobinfo>
  <div class="row">
    <div>Resume</div>
    <div>
      <span v-if="rcJobs.usercv.fname">{{rcJobs.usercv.fname}} {{rcJobs.usercv.lname}} (<a href="javascript:;" @click="goto({name:'user-resume'})">Edit</a>)</span>
      <span v-else><a href="javascript:;" @click="goto({name:'user-resume'})">Add CV</a></span>
    </div>
  </div>
  <div class="col">
    <div><farea name="cletter" label="Cover Letter" :value="rcJobs.af.cletter" @update="up"></farea></div> 
  </div>
  </card>
  <div class="row end-center py-2">
  <btn icon="pencil" size="md" text="Apply" @click="applySubmit"></btn>
  </div>
  `
}

export const applicants = {
  setup() {
    dbJobs.getJobs()
    return { rcJobs, dbJobs }
  },
  template: `<ul role="list" class="divide-y divide-gray-100">
  <listImage v-for="(j,i) in rcJobs.jobs" img="./assets/logo/logo-dark.svg" :a1="j.title" :a2="j.salary+j.currency" :b2="lc(j.remote, j.country)">
  </listImage>
  </ul>
  <btn text="truncate" bg="red" @click="dbJobs.flush"></btn>`,
  methods: {
    lc: (r, cy) => {
      return (r === true) ? "" : cy
    }
  }
}

export const jobForm = {
  setup() {
    const up = (obj) => {
      const f = obj.name
      rcJobs.add[f] = obj.value
    }
    const c = rcJobs.currencies
    const e = {}
    const add = () => {
      const errs = validate(rcJobs.add, rulesAdd)
      if (Object.keys(errs).length) {
        rcJobs.errors = errs
        return false
      }
      dbJobs.addJob()
    }
    const reset = () => {
      rcJobs.add = defaultAdd()
    }
    
    if (!rcJobs.categories.length) { 
      ctCats.fetch() 
    }
    
    return { up, rcJobs, c, optsJobLink, optsJobTypes, add, reset, ctCats}
  },
  template: `<card>
  <h2>Add Job</h2>
  <ftext name="company" label="Company name" 
    :value="rcJobs.add.company" @update="up">
  </ftext>
  <ftext name="title" label="Job Title" 
    :value="rcJobs.add.title" @update="up">
  </ftext>
  <fselect label="Job Type" name="type" :value="rcJobs.add.type"
  @update="up" :options="optsJobTypes">
    </fselect>
  <fselect label="Category" name="category" :value="rcJobs.add.category"
    @update="up" :options="rcJobs.catOptions">
      </fselect>
    
  <divide size="lg"></divide>
  
  <fcheck name="remote" text="Remote job" :checked="rcJobs.add.remote" @update="up"></fcheck>
  <div v-show="!rcJobs.add.remote" class="grid grid-cols-2 gap-2">
  <ftext name="city" label="City" 
    :value="rcJobs.add.city" @update="up">
  </ftext>
  <ftext name="country" label="Country" 
    :value="rcJobs.add.country" @update="up">
  </ftext>
  </div>
  
  <divide size="lg"></divide>
  
  <div class="grid grid-cols-2 gap-2 items-end">
  <ftext name="salary" label="Salary" 
    :value="rcJobs.add.salary" @update="up">
  </ftext>
  <fselect name="currency"
    :value="rcJobs.add.currency" @update="up" :options="c">
  </fselect>
  </div>
  <fselect label="Application link" name="link" :value="rcJobs.add.link"
  @update="up" :options="optsJobLink">
    </fselect>
  <ftext name="url" label="URL" 
    :value="rcJobs.add.url" @update="up" v-show="rcJobs.add.link=='external'"></ftext>
    
  <divide size="lg"></divide>
  
  <farea name="descr" label="Description" 
    :value="rcJobs.add.descr" @update="up">
  </farea>
  <errlist :errdata="rcJobs.errors"></errlist>
  </card>
  <div class="row between-center">
    <btn text="Clear" bg="gray" @click="reset"></btn>
    <btn text="Submit" @click="add"></btn>
  </div>
  `
}

export const jobsAdmin = {
  setup() {
    dbJobs.getJobs()
    return {rcJobs, optsJobTypes}
  },
  template: `
  <tablewrap>
    <template #thead>
    <th class="p-2">Company</th>
    <th class="p-2">Job Title</th>
    <th class="p-2">Job Type</th>
    <th class="p-2">Location</th>
    <th class="p-2">Salary</th>
    <th class="p-2">Applications</th>
    <th class="p-2">Featured</th>
    <th class="p-2">Actions</th>
    </template>
    <tr v-for="(row,i) in rcJobs.jobs">
    <td class="p-2">{{row['company']}}</td>
    <td class="p-2">{{row['title']}}</td>
    <td class="p-2">{{optsJobTypes[row['type']]}}</td>
    <td class="p-2"><badge text="Remote" size="sm" color="pink" v-if="row.remote"></badge>
      <span v-else>{{row.city}} / {{row.country}}</span>
    </td>
    <td class="p-2">
      {{row['salary']}} {{row.currency}}
    </td>
    <td class="p-2">
      {{row['external']?'External':'Internal'}} (num apps/clicks)
    </td>
    <td class="p-2">
      {{row['featured']?'Featured':''}}
    </td>
    <td class="p-2">
    </td>
    </tr>
</tablewrap>`
}

export const appsAdmin = {
  setup () {
    dbJobs.getAdminApplications()
    return {rcJobs, utils}
  },
  template: `<tablewrap>
<template #thead>
  <th class="p-2">User</th>
  <th class="p-2">Company</th>
  <th class="p-2">Job Title</th>
  <th class="p-2">Date of Aplication</th>
</template>
<tr v-for="(row,i) in rcJobs.adminapps">
  <td class="p-2">{{row['userid']}}</td>
  <td class="p-2">{{row['company']}}</td>
  <td class="p-2">{{row['jobid']}}</td>
  <td class="p-2">{{utils.date.nowdate()}}</td>
  <td class="p-2"></td>
</tr>
</tablewrap>`
}


export const ctCats = {
  q: () => { return { run: 'select', from: 'categories' } },
  fetch: () => {
    const q = ctCats.q()
    query(q).then(res => {
      rcJobs.categories = res
      res.forEach(row => {
        const k = row.id
        rcJobs.catOptions[k] = row.name
      })
    })
  },
  up: (obj) => {
    const f = obj.name
    rcJobs.form.addCategory[f] = obj.value
  },
  clickAdd: () => {
    rcJobs.show.addCategory = true
  },
  add: () => {
    const q = ctCats.q()
    q.run = "insert"
    q.data = rcJobs.form.addCategory
    query(q).then(res => {
      ctCats.fetch()
      ctCats.close()
    })
  },
  close: () => {
    rcJobs.show.addCategory = false
  }
}

export const categoriesAdmin = {
  setup() {
    
    if (!rcJobs.categories.length) { ctCats.fetch() }
    
    return { ctCats, rcJobs }
  },
  template: `
  <pagetop title="Jobs">
    <btn size="sm" icon="plus" bg="none" color="primary" text="Add category" @click="ctCats.clickAdd"></btn>
  </pagetop>
  <card title="Add category" v-show="rcJobs.show.addCategory">
    <ftext label="Category name" name="name" :value="rcJobs.form.addCategory.name" @update="ctCats.up"></ftext>
    <ftext label="Description" name="descr" :value="rcJobs.form.addCategory.descr" @update="ctCats.up"></ftext>
    <template #ftr>
      <div class="row between-center">
        <btn size="sm" text="cancel" bg="gray" @click="ctCats.close"></btn>
        <btn size="sm" text="submit" @click="ctCats.add"></btn>
      </div>
    </template>
  </card>
  <tablewrap>
  <template #thead>
    <th class="p-2">Name</th>
    <th class="p-2">Slug</th>
    <th class="p-2">Description</th>
    <th class="p-2">Actions</th>
  </template>
  <tr v-for="(row,i) in rcJobs.categories">
    <td class="p-2">{{row['name']}}</td>
    <td class="p-2">{{row['slug']}}</td>
    <td class="p-2">{{row['descr']}}</td>
    <td class="p-2"></td>
  </tr>
  </tablewrap>`
}



export const appsUser = {
  setup() {
      dbJobs.getUserApplications(store.me.id)
      return { rcJobs, utils }
    },
    template: `<tablewrap>
<template #thead>
    <th class="p-2">User</th>
    <th class="p-2">Company</th>
    <th class="p-2">Job Title</th>
    <th class="p-2">Date of Aplication</th>
</template>
  <tr v-for="(row,i) in rcJobs.userapps">
    <td class="p-2">{{row['userid']}}</td>
    <td class="p-2">{{row['company']}}</td>
    <td class="p-2">{{row['jobid']}}</td>
    <td class="p-2">{{utils.date.nowdate()}}</td>
    <td class="p-2"></td>
  </tr>
</tablewrap>`
}



export const resumeUser = {
  setup() {
    const tb = "resume"
    const up = (obj) => {
      const f = obj.name
      rcJobs.rf[f] = obj.value
    }
    
    const addedu = () => {
      rcJobs.rf.edu.push({'school':'', 'degree':'', 'grad':''})
    }
    
    const addexp = () => {
      rcJobs.rf.exp.push({ title: '', company: '', from: '', to: '', achieves: [] })
    }
    
    const addskl = () => {
      rcJobs.rf.skills.push({skill: '', level: '' })
    }
    
    const addlang = () => {
      rcJobs.rf.langs.push({lang: '', level: '' })
    }
    
    const addcert = () => {
      rcJobs.rf.certs.push({name: '', ins: '' })
    }
    
    const addcrs = () => {
      rcJobs.rf.courses.push({ name:'', ins:'', completedAt:''})
    }
    
    const saverf = () => {
      const errs = validate(rcJobs.rf, rulesResume)
      if (Object.keys(errs).length) {
        rcJobs.errors = errs
        return false
      }
      rcJobs.rf.userid = store.me.id
      dbJobs.addResume().then(res => {
        alert('success')
        rcJobs.usercv = res
      })
    }
    
    const reset = () => {
      rcJobs.rf = defaultResume()
    }
    
    dbJobs.getUserResume(store.me.id).then(res => {
      if(res.fname) {
        rcJobs.rf = res
      }
    })
    
    const soc = {
      site: '',
      url: '',
      up: (obj) => {
        const f = obj.name
        soc[f] = obj.value
      },
      add: () => {
        
      }
    }
    
    return {rcJobs, up, soc, addexp, addedu, addskl, addlang, addcert, addcrs, saverf, reset, optsGender}
  },
  template: `<card>
  <h2>Edit CV</h2>
  
  <div class="grid grid-cols-2 gap-x-2">
  <ftext name="fname" label="First Name" :value="rcJobs.rf.fname" @update="up"></ftext>
  <ftext name="lname" label="Last Name" :value="rcJobs.rf.lname" @update="up"></ftext>
  <fselect name="gender" label="Gender" :value="rcJobs.rf.gender" @update="up" :options="optsGender"></fselect>
  <fselect name="nationality" label="Nationality" :value="rcJobs.rf.nationality" :options="{'US':'USA', 'FR': 'France'}" @update="up"></fselect>
  </div>
  
  <divide size="lg"></divide>

  
  <h3>Contact Information</h3>
  <div class="grid grid-cols-3 gap-1 mb-4">
  <ftext name="email" label="Email" :value="rcJobs.rf.email" @update="up"></ftext>
  <ftext name="phone" label="Phone" :value="rcJobs.rf.phone" @update="up"></ftext>
  <ftext name="website" label="Website" :value="rcJobs.rf.website" @update="up"></ftext>
  </div>
  
  <divide size="lg"></divide>
  
  <h3 class="mt-4">Personal Statement</h3>
  <ftext name="title" label="Title" :value="rcJobs.rf.title" @update="up"></ftext>
  <farea name="statement" label="Statement" :value="rcJobs.rf.statement" @update="up"></farea>
  
  <divide size="lg"></divide>

  <h3>Work Experience</h3>
  <div class="grid grid-cols-2 gap-2" v-for="(exrow, i) in rcJobs.rf.exp">
  <ftext name="exp[i].title" label="Title" @update="up" :value="rcJobs.rf.exp[i].title"></ftext> 
  <ftext name="exp[i].degree" label="Company"  @update="up" :value="rcJobs.rf.exp[i].company"></ftext> 
  <ftext type="date" name="exp[i].from" label="Start" @update="up" :value="rcJobs.rf.exp[i].from"></ftext> 
  <ftext type="date" name="exp[i].to" label="End" @update="up" :value="rcJobs.rf.exp[i].to"></ftext>

  </div>
  <div class="mb-4"><a href="javascript:;" class="row start-center" @click="addexp"><icon class="mr-1" name="plus"></icon> Add more</a></div> </div>

  <divide size="lg"></divide>

  <h3>Education</h3>
  <div class="grid grid-cols-3 gap-2" v-for="(edrow, i) in rcJobs.rf.edu">
  <ftext name="edu[i].ins" label="Name of School" @update="up" :value="rcJobs.rf.edu[i].ins"></ftext> 
  <ftext name="edu[i].degree" label="Degree"  @update="up" :value="rcJobs.rf.edu[i].degree"></ftext> 
  <ftext name="edu[i].grad" label="Graduation Year" @update="up" :value="rcJobs.rf.edu[i].grad"></ftext> 
  </div>
  <div class="mb-4"><a href="javascript:;" class="row start-center" @click="addedu"><icon class="mr-1" name="plus"></icon> Add more</a></div>
  </div>
  
  <divide size="lg"></divide>

  <h3>Skills</h3>
  <div class="grid grid-cols-2 gap-2" v-for="(skrow, i) in rcJobs.rf.skills">
    <ftext name="skill" label="Name (e.g SASS)" :value="skrow.skill" @update="up"></ftext>
    <ftext name="level" label="Level" :value="skrow.level" @update="up"></ftext>
  </div>
  <div class="mb-4"><a href="javascript:;" class="row start-center" @click="addskl"><icon class="mr-1" name="plus"></icon> Add more</a></div> </div>
  
  <divide size="lg"></divide>

  <h3>Languages</h3>
  <div class="grid grid-cols-2 gap-2" v-for="(lgrow, i) in rcJobs.rf.langs">
    <ftext name="lang" label="Name" :value="lgrow.lang" @update="up"></ftext>
    <ftext name="level" label="Level" :value="lgrow.level" @update="up"></ftext>
  </div>
  <div class="mb-4"><a href="javascript:;" class="row start-center" @click="addlang"><icon class="mr-1" name="plus"></icon> Add more</a></div> </div>
  
  <divide size="lg"></divide>

  <h3>Certifications</h3>
  <div class="grid grid-cols-2 gap-2" v-for="(crtrow, i) in rcJobs.rf.certs">
    <ftext name="name" label="Name" :value="crtrow.name" @update="up"></ftext>
    <ftext name="ins" label="Institution" :value="crtrow.ins" @update="up"></ftext>
  </div>
  <div class="mb-4"><a href="javascript:;" class="row start-center" @click="addcert"><icon class="mr-1" name="plus"></icon> Add more</a></div> </div>
  
  <divide size="lg"></divide>

  <h3>Courses</h3>
  <div class="grid grid-cols-3 gap-1" v-for="(crsrow, i) in rcJobs.rf.courses">
    <ftext name="name" label="Name" :value="crsrow.name" @update="up"></ftext>
    <ftext name="ins" label="Institution" :value="crsrow.ins" @update="up"></ftext>
    <ftext name="completedAt" label="Date Completed" :value="crsrow.completedAt" @update="up"></ftext>
  </div>
  <div class="mb-4"><a href="javascript:;" class="row start-center" @click="addcrs"><icon class="mr-1" name="plus"></icon> Add more</a></div> </div>
  
  <divide size="lg"></divide>
  
  <h3>Social Links</h3>
  <div class="grid grid-cols-3 gap-1 mb-4">
  <ftext name="fname" label="Site (e.g LinkedIn)" :value="soc.site" @update="soc.up"></ftext>
  <ftext name="lname" label="URL" :value="soc.url" @update="soc.up"></ftext>
  <btn text="Add" bg="none" color="indigo" @click="soc.add"></btn>
  
  <errlist :errdata="rcJobs.errors"></errlist>
  </card>
  
  
  <div class="row between-center">
     <btn text="Clear" bg="gray" @click="reset"></btn>
     <btn text="Save" @click="saverf"></btn>
  </div>
  `
}

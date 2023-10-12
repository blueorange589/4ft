/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
import { logger } from '../store.js'

const delay = 100
export function save(table, data) {
  const jn = JSON.stringify(data)
  localStorage.setItem(table, jn)
}

export function retrieve(table) {
  const dt = localStorage.getItem(table)
  const res = dt ? JSON.parse(dt) : false
  return new Promise(resolve => setTimeout(resolve, delay, res));
}

export async function selectAll(table) {
  const dt = await retrieve(table)
  const res = dt || false
  return new Promise(resolve => setTimeout(resolve, delay, res));
}

export async  function selectRows(table, filters) {
  const dt = await retrieve(table)
  
  if (!dt) {
    return new Promise(resolve => setTimeout(resolve, delay, false));
  }
  const res = dt
  
  return new Promise(resolve => setTimeout(resolve, delay, res));
}

export async function selectAt (table, idx) {
  const dt = await retrieve(table)
  if (!dt) {
    return new Promise(resolve => setTimeout(resolve, delay, false));
  }
  const res = dt[idx]
  return new Promise(resolve => setTimeout(resolve, delay, res));
}

export async function selectRow(table, k, val) {
  const dt = await retrieve(table)
  
  if (!dt) {
    return new Promise(resolve => setTimeout(resolve, delay, false));
  }
  const res = dt.filter((v, idx) => {
    return v[k] === val 
  })
  const row = res[0]
  return new Promise(resolve => setTimeout(resolve, delay, row));
}

export async function insertRow(table, row) {
  const dt = await selectAll(table)
  if(Array.isArray(dt)) {
    dt.push(row)
    save(table, dt)
    return new Promise(resolve => setTimeout(resolve, delay, dt));
  }
  alert('create table:'+table)
  const dtb = []
  dtb.push(row)
  save(table, dtb)
  return new Promise(resolve => setTimeout(resolve, delay, dtb));
}

export async function insertRows(table, data) {
  let dt = await selectAll(table)
  if(!dt) { dt = [] }
  
  let rows = data
  if(!Array.isArray(data)) {
    rows = [data]
  }
  
  rows.forEach(row => {
    dt.push(row)
  })
  save(table, dt)
  return new Promise(resolve => setTimeout(resolve, delay, dt));
}

export async function updateRow(table, key, row) {
  let dt = await selectAll(table)
  dt[key] = row
  save(table, dt)
  return new Promise(resolve => setTimeout(resolve, delay, dt));
}


export function truncateAll() {
  localStorage.clear()
  return new Promise(resolve => setTimeout(resolve, delay, true));
}

export function truncate(table) {
  save(table, [])
  return new Promise(resolve => setTimeout(resolve, delay, true));
}

export async function query(q) {
  if(!q) alert('query was not provided')
  let res = {}
  if(q.run === 'select') {
    res = await selectAll(q.from)
  }
  
  if(q.run === 'insert') {
    res = await insertRows(q.from, q.data)
  }
  
  if(q.run === 'update') {
    res = await updateRows(q.from, q.match, q.data)
  }
  
  if(res && q.eq) {
    const f = Object.keys(q.eq) 
    if (f.length) {
      f.forEach((col) => {
        res = res.filter((obj, idx) => {
          return obj[col] === q.eq[col]
        })
      })
    }
  }

  return new Promise(resolve => setTimeout(resolve, delay, res));
}
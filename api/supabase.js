/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

export async function query(q) {
  let query = supabase
  query.from(q.from)

  if (q.run === "select") {
    const sel = q.select || '*'
    query.select(sel)
  }

  if (q.run === "insert") {
    query.insert(q.insert)
  }

  if (q.run === "update") {
    query.update(q.values)
  }

  if (q.run === "delete") {
    query.delete()
  }

  // matchers
  if (q.eq) { query.eq(q.eq) }
  if (q.gt) { query.gt(q.gt) }
  if (q.lt) { query.lt(q.lt) }

  // sorting
  if (q.order) {
    const cols = Object.keys(q.order)
    cols.forEach(col => {
      const ascending = q.order[col] === 'asc' ? true : false
      query.order(col, { ascending })
    })
  }

  if (q.single) {
    query.single()
  }

  const { data, error } = await query

  return { data, error }
}

export const auth = {
  saveSession: (session) => {
    // setCookie()
  },
  getSession: () => {
    const session = supabase.auth.session()
    return { session }
  },
  signIn: (params) => {
    // {email: email, password: password}
    // {provider: 'github'}
    const { user, session, error } = await supabase.auth.signIn(params)
    auth.saveSession(session)
    return { user, session, error }
  },
  signOut = () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  signUp = (params) => {
    // login: email, password
    // data: columns
    const { user, session, error } = await supabase.auth.signUp(params.login, params.data)
  },
  resetPassword = (params) => {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(params.email)
    return { data, error }
  },
  setAuth: () => {
    const session = auth.getSession()
    const { user, error } = await supabase.auth.setAuth(session.access_token)
    return { user, error }
  },
  getUserFromSession: () => {
    const session = auth.getSession()
    const { user, error } = await supabase.auth.api.getUser(access_token) 
    return { user, error }
  },
  getUser: () => {
    const user = await supabase.auth.user()
    return { user }
  }
}

export const useSupabaseStorage = () => {
  return supabase.storage
}
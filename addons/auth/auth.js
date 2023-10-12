/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { reactive, ref, h } = Vue;
const { useRoute, useRouter } = VueRouter;


const auth = {}


auth.data = reactive({
  login: {
    email: 'test1',
    password: 'test1pwd',
    remember: true
  }
})



auth.events = {
  signIn: () => {
    console.log(auth.data.login)
  }
}



export const container = {
  name: 'auth',
  setup(props, ctx) {
    console.log('auth started')
    return {auth, ctx}
  }
  // template: ``
}
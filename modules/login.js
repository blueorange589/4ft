/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const { useRouter } = VueRouter;
import {store} from './app/store.js';

export const login = {
  setup() {
    const r = useRouter()
    const signIn = () => {
      store.signIn().then(res => {
        if(res===true) {
          const n = store.nextPage.name ? store.nextPage : {name: 'site-home'}
          alert(n.name)
          r.push(n)
        }
      })
    }
    return { store, signIn }
  },
  template: `<div class="w-full h-full col center-center">
    <div class="relative w-72 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 class="text-4xl font-medium">Login</h1>
        <p class="text-slate-500">Hi, Welcome back 👋</p>

        <div class="my-5">
            <btn bg="indigo" text="Login with Google"></btn>
        </div>
        <form action="" class="my-10">
            <div class="flex flex-col space-y-5">
            <ftext type="email" name="email" label="Email"></ftext>
            <ftext type="password" name="password" label="Password"></ftext>
                <div class="flex flex-row justify-between">
                    <fcheck name="remember" text="Remember me"></fcheck>
                    <div>
                        <a href="#" class="font-medium text-indigo-600">Forgot Password?</a>
                    </div>
                </div>
                <btn text="Login" bg="indigo" icon="enter" @click="signIn"></btn>
                <p class="text-center">Not registered yet? <a href="#" class="text-indigo-600 font-medium inline-flex space-x-1 items-center"><span>Register now </span><icon name="external"></icon></a></p>
            </div>
        </form>
          </div></div>`
}


/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
export const listImage = {
  props:["img", "a1", "a2", "b1", "b2"],
  template: `
          <li class="row between px-2 py-4">
            <div class="flex min-w-0 gap-x-4 center">
              <slot></slot>
              <div class="min-w-0 flex-auto pl-4">
                <p class="text-sm font-semibold leading-6 text-gray-900">{{a1}}</p>
                <p class="mt-1 truncate text-xs leading-5 text-gray-500">{{a2}}
              </div>
            </div>
             <div class="col end min-w-0 flex-auto text-right">
              <p class="text-sm leading-6 text-gray-900">{{b1}}</p>
              <p class="mt-1 text-xs leading-5 text-gray-500">{{b2}}</p>
              </div>
          </li>
  `
}

export const listItem = {
  template: `<li class="row between-center px-2 py-4 border-b">
    <slot></slot>
  </li>`
}
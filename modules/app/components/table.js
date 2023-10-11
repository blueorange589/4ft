/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
export const tablewrap = {
  template: `<div class="mt-4">
  <div class="w-full overflow-hidden rounded-lg shadow-xs">
    <div class="w-full overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 border-b border-third dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
          <slot name="thead"></slot>
        </tr>
      </thead>
      <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
      <slot></slot>
        </tbody> 
        </table> 
    </div>
  </div>
</div>`
}
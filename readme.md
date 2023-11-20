# No build app platform, using Vue/Tailwind

4ft aims and provides tools to fasten development process by removing necessity of development builds.


Entire app runs on <script type=”module”, so all changes are immediately reflected on browser preview.

Not only it cuts time for development, 4ft is also way more performant, since entire app is running on client side, which is also less server loads.


Designed to work in Node, Nginx and Apache servers.

Uses standard JS object for database queries, to support all databases.

` {run:"update", from: “mytable”, match: {id:1}, data:{username: "4ftuser"} } `



Finally, it provides complete View/Controller seperation.

Each view taken from database on app load (app.js 139-147) and applied before route enter (app.js 167-178). So there are no view files hosted.


Each controller is an addon, with just `addon.data` and `addon.events` to be coded. (addons/auth/auth.js)





### Special thanks

Evan You and Vue team

Supabase

Tailwind CSS

Vercel

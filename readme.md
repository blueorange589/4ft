# No build platform, with in-app dev tools, using Vue/Tailwind

4ft aims and provides tools to fasten development process by removing necessity of development builds.


Entire app runs on <script type=”module”, so all changes are immediately reflected on browser preview.


As for server side, only /api folder requires node server running, which is a gateway for all external and backend processes.


In addition, it also provides development tools within the app gets developed;

* UIKitBuilder
* LayoutBuilder
* console
* tests
* styles
* data
* dev. settings (enable/disable login… etc.)
* responsive preview


During development it uses localStorage wrapper, which eliminates requirement to connect development database, so it’s faster again :grinning: All sample data can be truncated/filled on a button click at data tab.


==*__All equals that you only need your IDE and a live preview window during modern app development.__*==


Not only it cuts development time, 4ft is also way more performant, since entire app is running on client side, which is also less server loads.


Designed to work in Node, Nginx and Apache servers. (Node server support not ready yet)


For end users it enables UIKit and layout building, in addition to attaching elements to events. Addons are autoloaded by 4ft, so users can enable functionality needed, by just uploading (possibly by downloading in future) them into /addons folder. 





:::info
most of the code to be reorganized, which is underway. It’s ready for preview though.

:::



### Contributions

Can you maintain the repo? 4ft wants you.

Are you a react developer? 4ft is happy to have a react friend.


Features to implement are listed in ‘Projects’ tab. Feel free to grab yours and send me a message before starting. (blueorange589@gmail.com)


### Special special thanks

Evan You and Vue team

Supabase

Tailwind CSS

Vercel
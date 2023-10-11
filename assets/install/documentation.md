## UIKitBuilder

## Deployment

UIKitBuilder is a static app which runs on client side. It means, you can use it on any host can serve HTML/JS files.

All you need to do is to upload your files to your host. When upload is complete your app should be available for use.

### Deployment on Vercel

You can deploy to Vercel using no webpack method described at the end of [this article.](https://stefankudla.com/posts/how-to-deploy-a-static-html-css-and-javascript-website-to-vercel)

## How To Use

After deployment you can visit URL of your site and app should launch.

### Creating new UI Kit

On homepage you can click ‘create new’ button and it will take you to builder page with a blank design.

### Adding new elements

You can click ‘add element’ button on builder page and provide name, tag and section for your new element. After submitted, new element will be placed on left menu and also in preview section.

### Adding new sections

Sections are useful to keep your work organized by grouping elements on preview and on left menu. You can create a new section by clicking ‘add new section’ button and providing a name. Name should be lowercase and only alphanumeric (a-z).

### Saving your designs

You can click save button at top of the builder and provide a name for your design to access it later easily. If it’s a previously saved work, it will update the existing design without asking a name.

### Switch designs

Anytime you can switch your designs using selectbox at top of builder page. Although you won’t lose previous designs changes by switching between designs, it’s a good practice to save current design before switching.

### Export designs

When your work is done, you can hit ‘export CSS’ button at top of builder page, which will give you a full CSS file of all your elements. Element names will be provided as CSS class names. You can directly use provided CSS file in your app.

### Delete designs

You can use ‘delete’ button at top of builder page to delete the design currently loaded.

## FAQ

**How can I prevent others to access my app?**

If you will be using Vercel, you can use [Vercel Authentication](https://vercel.com/docs/security/deployment-protection#vercel-authentication) to restrict access for your app.

On Apache servers you can use .htpasswd, or hosting providers interface to restrict access on page. Same technique can be used for all server types.pp
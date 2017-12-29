![Alt](https://user-images.githubusercontent.com/516709/34438038-003320be-eca4-11e7-97b3-f3ece95d6a27.PNG)
Express Starter
=======================

[![Build Status](https://travis-ci.org/yhnavein/express-starter.svg?branch=master)](https://travis-ci.org/yhnavein/express-starter)
[![Dependency Status](https://david-dm.org/yhnavein/express-starter/status.svg?style=flat)](https://david-dm.org/yhnavein/express-starter)
[![Code Climate](https://codeclimate.com/github/yhnavein/express-starter/badges/gpa.svg)](https://codeclimate.com/github/yhnavein/express-starter)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://yhnavein.mit-license.org)

**Live Demo**: https://express-starter.herokuapp.com/

A boilerplate for **Node.js** web applications, which use RDBS (relational database system) with prefered PostgreSQL instead of overhyped MongoDB.

Project based on and inspired by [Hackathon Starter](https://github.com/sahat/hackathon-starter).

With this boilerplate you can start a brand new application using **node.js** with multiple base features working out-of-a-box. So you can focus on the important stuff you want to create.

Take a look on the [Features](#features) section to see what's already done for you!

![](https://cloud.githubusercontent.com/assets/516709/11047844/c489c3d2-8734-11e5-92b7-d73b7d39c304.png)

Table of Contents
-----------------

- [Why not MEAN?](#why-not-mean)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Generator](#generator)
- [Obtaining API Keys](#obtaining-api-keys)
- [Project Structure](#project-structure)
- [List of Packages](#list-of-packages)
- [Useful Tools and Resources](#useful-tools-and-resources)
- [Recommended Design Resources](#recommended-design-resources)
- [Recommended Node.js Libraries](#recommended-nodejs-libraries)
- [Recommended Client-side Libraries](#recommended-client-side-libraries)
- [Pro Tips](#pro-tips)
- [FAQ](#faq)
- [How It Works](#how-it-works-mini-guides)
- [Deployment](#deployment)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

Why not MEAN?
-------------

There are tons of *MEAN* boilerplates and even more **node.js** stacks that include **MongoDB** by default. But there is a shortage of good and easy-to-use starters for people who want to use relational databases.

Why should you use RDBS? That's a very good question. But the better would be to ask: Why should you use **NoSQL** database in the first place?

There are some situations when NoSQLs are very wise choice, but in the most cases in your applications you will need to store relational data and you want to store it safely and process stored info very quickly. And to that you don't need a MongoDB.

For some time there was a very big advantage in using **MongoDB** with the **node.js** applications. That is, it was a really easy and straightforward to save and retrieve any json object using just a one-liner, which at that point was not that easy with relational databases.

Problem was partially solved by **PostgreSQL 9.3** which introduced a new `JSON` field type, which allows not only to store any JSON object, but also query it as well. And you still have a proper and *ACID*-compliant relational database!

So, if you care about **security** of your data *AND* **performance** *AND* **reliability** *AND* you want to use **node.js** stack, then you should avoid *MEAN* and at least try **Express Starter**.

Features
--------

- really secure **Local Authentication** using Email and Password (**bcrypt** is used)
- **OAuth 1.0a Authentication** via Twitter
- **OAuth 2.0 Authentication** via Facebook, Google, GitHub, LinkedIn
- Flash notifications
- MVC Project Structure
- Rails 3.1-style asset pipeline by connect-assets (See FAQ)
- LESS stylesheets (auto-compiled without any Gulp/Grunt hassle)
- Bootstrap 3 + Flat UI + iOS7
- Contact Form (powered by Sendgrid by default, but Mailgun and Mandrill can be used as well)
- **Account Management**
 - Gravatar
 - Profile Details
 - Change Password
 - Forgot Password
 - Reset Password
 - Password Strength Meter (based on [zxcvbn](https://github.com/dropbox/zxcvbn))
 - Link multiple OAuth strategies to one account
 - Unlink OAuth accounts
 - Delete Account
- CSRF protection
- **API Examples**: Facebook, Steam, Twitter, Stripe, LinkedIn and more.
- Unit and Integrational Tests

Prerequisites
-------------

- [PostgreSQL](http://www.postgresql.org/download/) or [MySQL](http://www.mysql.com/downloads/)
- [Node.js](http://nodejs.org)
- Command Line Tools
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17">&nbsp;**Mac OS X**: [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9 Mavericks**: `xcode-select --install`)
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17">&nbsp;**Ubuntu**: `sudo apt-get install build-essential`
 - <img src="http://i1-news.softpedia-static.com/images/extra/LINUX/small/slw218news1.png" height="17">&nbsp;**Fedora**: `sudo dnf groupinstall "Development Tools"`
 - <img src="https://en.opensuse.org/images/b/be/Logo-geeko_head.png" height="17">&nbsp;**OpenSUSE**: `sudo zypper install --type pattern devel_basis`

Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
$ git clone https://github.com/yhnavein/express-starter.git myproject
$ cd myproject
$ git remote rm origin

# Install NPM dependencies
$ npm install -d

# Adjust settings to your needs
$ vim config/secrets.js

$ node app.js
```

In `config/secrets.js` you may want to change database configuration. You don't have to change all API keys, because they will work on your localhost without any hassle. You will need to change API keys, when deploying application to the server.

**Note:** It is recommended to store your API keys and other sensitive data as environment variables. This project uses the 'dotenv' package to retrieve the contents of a '.env' file in your root directory. To store your variables create a '.env' file in the root directory (the same place that app.js is) and place you environment variables in the following format:

```bash
SESSION_SECRET=YourSessionSecretGoesHere
```
Then, make sure you add this line
```bash
.env
```
to your .gitignore file.
and you can now access the SESSION_SECRET variable in the secrets.js file as:
```bash
process.env.SESSION_SECRET
```
**Note:** I highly recommend installing [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node app.js` use `nodemon app.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon`.

Obtaining API Keys
------------------

To use any of the included APIs or OAuth authentication methods, you will need
to obtain appropriate credentials: Client ID, Client Secret, API Key, or
Username & Password. You will need to go through each provider to generate new
credentials.

**Important Notice:** I have included dummy keys and passwords for
all API examples to get you up and running even faster. But don't forget to update
them with *your credentials* when you are ready to deploy an app.

<img src="http://images.google.com/intl/en_ALL/images/srpr/logo6w.png" width="200">
- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Click on the **Create Project** button
- Enter *Project Name*, then click on **Create** button
- Then click on *APIs & auth* in the sidebar and select *API* tab
- Click on **Google+ API** under *Social APIs*, then click **Enable API**
- Next, under *APIs & auth* in the sidebar click on *Credentials* tab
- Click on **Create new Client ID** button
- Select *Web Application* and click on **Configure Consent Screen**
- Fill out the required fields then click on **Save**
- In the *Create Client ID* modal dialog:
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: http://localhost:3000
 - **Authorized redirect URI**: http://localhost:3000/auth/google/callback
- Click on **Create Client ID** button
- Copy and paste *Client ID* and *Client secret* keys into `config/secrets.js`

**Note:** When you ready to deploy to production don't forget to
add your new url to *Authorized Javascript origins* and *Authorized redirect URI*,
e.g. `http://my-awesome-app.herokuapp.com` and
`http://my-awesome-app.herokuapp.com/auth/google/callback` respectively.
The same goes for other providers.

<hr>

<img src="http://www.doit.ba/img/facebook.jpg" width="200">
- Visit [Facebook Developers](https://developers.facebook.com/)
- Click **Apps > Create a New App** in the navigation bar
- Enter *Display Name*, then choose a category, then click **Create app**
- Copy and paste *App ID* and *App Secret* keys into `config/secrets.js`
 - *App ID* is **clientID**, *App Secret* is **clientSecret**
- Click on *Settings* on the sidebar, then click **+ Add Platform**
- Select **Website**
- Enter `http://localhost:3000` for *Site URL*

**Note:** After a successful sign in with Facebook, a user will be redirected back to home page with appended hash `#_=_` in the URL. It is *not* a bug. See this [Stack Overflow](https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url) discussion for ways to handle it.

<hr>

<img src="https://github.global.ssl.fastly.net/images/modules/logos_page/GitHub-Logo.png" width="200">
- Go to [Account Settings](https://github.com/settings/profile)
- Select **Applications** from the sidebar
- Then inside **Developer applications** click on **Register new application**
- Enter *Application Name* and *Homepage URL*
- For *Authorization Callback URL*: http://localhost:3000/auth/github/callback
- Click **Register application**
- Now copy and paste *Client ID* and *Client Secret* keys into `config/secrets.js`

<hr>

<img src="https://g.twimg.com/Twitter_logo_blue.png" width="90">
- Sign in at [https://apps.twitter.com/](https://apps.twitter.com/)
- Click **Create a new application**
- Enter your application name, website and description
- For **Callback URL**: http://127.0.0.1:3000/auth/twitter/callback
- Go to **Settings** tab
- Under *Application Type* select **Read and Write** access
- Check the box **Allow this application to be used to Sign in with Twitter**
- Click **Update this Twitter's applications settings**
- Copy and paste *Consumer Key* and *Consumer Secret* keys into `config/secrets.js`

<hr>

<img src="http://www.danpontefract.com/wp-content/uploads/2014/02/logo-linkedin.png" width="200">
- Sign in at [LinkedIn Developer Network](http://developer.linkedin.com/)
- From the account name dropdown menu select **API Keys**
 - *It may ask you to sign in once again*
- Click **+ Add New Application** button
- Fill out all the *required* fields
 - **OAuth 2.0 Redirect URLs**: http://localhost:3000/auth/linkedin/callback
 - **JavaScript API Domains**: http://localhost:3000
- For **Default Scope** make sure *at least* the following is checked:
 - `r_basicprofile`
- Finish by clicking **Add Application** button
- Copy and paste *API Key* and *Secret Key* keys into `config/secrets.js`
 - *API Key* is your **clientID**
 - *Secret Key* is your **clientSecret**

<hr>

<img src="https://s3.amazonaws.com/venmo/venmo_logo_blue.png" width="200">
- Visit the **Account** section of your Venmo profile after logging in
- Click on the **Developers** tab
- Then click on the [new](https://venmo.com/account/app/new) link next to **Your Applications (0)**
- Fill in the required fields: *App Name* and *What Will The App Be Used For?*
- For **Web Redirect URL** enter: http://localhost:3000/auth/venmo/callback
- Hit **Create** button
- Back on the **Developers** tab click on **view** link next to **Your Applications (1) new**
- Copy and paste **ID** and **Secret** keys into `config/secrets.js`

<hr>

<img src="https://stripe.com/img/about/logos/logos/black@2x.png" width="200">
- [Sign up](http://stripe.com) or log into your [dashboard](https://manage.stripe.com)
- Click on your profile and click on Account Settings
- Then click on [API Keys](https://manage.stripe.com/account/apikeys)
- Copy the **Secret Key**. and add this into `config/secrets.js`
<hr>

<img src="https://www.paypalobjects.com/webstatic/developer/logo_paypal-developer_beta.png" width="200">
- Visit [PayPal Developer](https://developer.paypal.com/)
- Log in to your PayPal account
- Click **Applications > Create App** in the navigation bar
- Enter *Application Name*, then click **Create app**
- Copy and paste *Client ID* and *Secret* keys into `config/secrets.js`
- *App ID* is **client_id**, *App Secret* is **client_secret**
- Change **host** to api.paypal.com if you want to test against production and use the live credentials

<hr>

<img src="https://playfoursquare.s3.amazonaws.com/press/2014/foursquare-logomark.png" width="200">
- Go to [foursquare for Developers](https://developer.foursquare.com/)
- Click on **My Apps** in the top menu
- Click the **Create A New App** button
- Enter *App Name*, *Welcome page url*,
- For **Redirect URI**: http://localhost:3000/auth/foursquare/callback
- Click **Save Changes**
- Copy and paste *Client ID* and *Client Secret* keys into `config/secrets.js`

<hr>

<img src="http://www.technologytell.com/gaming/files/2012/01/steam_logo.jpg" width="200">
- Go to http://steamcommunity.com/dev/apikey
- Sign in with your existing Steam account
- Enter your *Domain Name*, then and click **Register**
- Copy and paste *Key* into `config/secrets.js`

<hr>

<img src="http://iandouglas.com/presentations/pyconca2012/logos/sendgrid_logo.png" width="200">
- Go to https://sendgrid.com/user/signup
- Sign up and **confirm** your account via the *activation email*
- Then enter your SendGrid *Username* and *Password* into `config/secrets.js`

<hr>

<img src="https://raw.github.com/mailgun/media/master/Mailgun_Primary.png" width="200">
- Go to http://www.mailgun.com
- Sign up and add your *Domain Name*
- From the domain overview, copy and paste the default SMTP *Login* and *Password* into `config/secrets.js`

<hr>

<img src="http://cdn.appstorm.net/web.appstorm.net/web/files/2013/12/mandrill-logo.png" width="100">
- Go to http://mandrill.com
- Sign up and add your *Domain Name*
- From the dashboard, click on *Get SMTP credentials*
- Copy and paste the default SMTP *Login* and *Password* into `config/secrets.js`

<hr>

<img src="https://www.bitgo.com/img/new_bitgo/logo_footer.png" width="200">
- Go to https://test.bitgo.com/
- Sign up for an account.
- Once logged into the dashboard, go to the top right selector and click 'account settings'
- Under the developers tab, create your access token and copy and paste it into `config/secrets.js`


Project Structure
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **config**/passport.js             | Passport Local and OAuth strategies, plus login middleware.  |
| **config**/secrets.js              | Your API keys, tokens, passwords and database URL.           |
| **controllers**/api.js             | Controller for /api route and all api examples.              |
| **controllers**/contact.js         | Controller for contact form.                                 |
| **controllers**/home.js            | Controller for home page (index).                            |
| **controllers**/user.js            | Controller for user account management.                      |
| **models**/**sequelize**/User.js   | Sequelize schema and model for User.                         |
| **models**/**sequelize**/Session.js| Schema for Session table (used for convenience)              |
| **models**/**sequelize**/index.js  | Tool for easy managing all of the table schemas              |
| **public**/                        | Static assets (fonts, css, js, img).                         |
| **public**/**js**/application.js   | Specify client-side JavaScript dependencies.                 |
| **public**/**js**/main.js          | Place your client-side JavaScript here.                      |
| **public**/**css**/main.less       | Main stylesheet for your app.                                |
| **public/css/themes**/default.less | Some Bootstrap overrides to make it look prettier.           |
| **views/account**/                 | Templates for *login, password reset, signup, profile*.      |
| **views/api**/                     | Templates for API Examples.                                  |
| **views/partials**/flash.ejs       | Error, info and success flash notifications.                 |
| **views/partials**/header.ejs      | Navbar partial template.                                     |
| **views/partials**/footer.ejs      | Footer partial template.                                     |
| **views**/layout.ejs               | Base template.                                               |
| **views**/home.ejs                 | Home page template.                                          |
| app.js                             | Main application file.                                       |

**Note:** There is no preference how you name or structure your views.
You could place all your templates in a top-level `views` directory without
having a nested folder structure, if that makes things easier for you.
Just don't forget to update `extends ../layout`  and corresponding
`res.render()` paths in controllers.

List of Packages
----------------

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| bcrypt-nodejs                   | Library for hashing and salting user passwords.                       |
| bitgo                           | Multi-sig Bitcoin wallet API.  																				|
| cheerio                         | Scrape web pages using jQuery-style syntax.                           |
| clockwork                       | Clockwork SMS API library.                                            |
| connect-assets                  | Compiles LESS stylesheets, concatenates & minifies JavaScript.        |
| csso                            | Dependency for connect-assets library to minify CSS.                  |
| ejs                             | Template engine for Express.                                          |
| ejs-mate                        | Layouts and partials support for the EJS                              |
| express                         | Node.js web framework.                                                |
| body-parser                     | Express 4.0 middleware.                                               |
| cookie-parser                   | Express 4.0 middleware.                                               |
| morgan                          | Express 4.0 middleware.                                               |
| multer                          | Express 4.0 middleware.                                               |
| compression                     | Express 4.0 middleware.                                               |
| errorhandler                    | Express 4.0 middleware.                                               |
| method-override                 | Express 4.0 middleware.                                               |
| serve-favicon                   | Express 4.0 middleware offering favicon serving and caching.          |
| express-flash                   | Provides flash messages for Express.                                  |
| express-session                 | Express 4.0 middleware.                                               |
| express-validator               | Easy form validation for Express.                                     |
| fbgraph                         | Facebook Graph API library.                                           |
| github-api                      | GitHub API library.                                                   |
| knex                            | SQL query builder (useful but not mandatory)                          |
| lastfm                          | Last.fm API library.                                                  |
| less                            | LESS compiler. Used implicitly by connect-assets.                     |
| lob                             | Lob API library                                                       |
| lusca                           | CSRF middleware.                                                      |
| node-linkedin                   | LinkedIn API library.                                                 |
| neo-async                       | Utility library that provides asynchronous control flow.              |
| passport                        | Simple and elegant authentication library for node.js                 |
| passport-facebook               | Sign-in with Facebook plugin.                                         |
| passport-github                 | Sign-in with GitHub plugin.                                           |
| passport-google-oauth           | Sign-in with Google plugin.                                           |
| passport-twitter                | Sign-in with Twitter plugin.                                          |
| passport-local                  | Sign-in with Username and Password plugin.                            |
| passport-linkedin-oauth2        | Sign-in with LinkedIn plugin.                                         |
| passport-oauth                  | Allows you to set up your own OAuth 1.0a and OAuth 2.0 strategies.    |
| paypal-rest-sdk                 | PayPal APIs library.                                                  |
| pg                              | PostgreSQL client                                                     |
| pg-hstore                       | Module for handling JSON data in Postgres (required if you use JSON)  |
| request                         | Simplified HTTP request library.                                      |
| sequelize                       | Multi-dialect ORM for node.js                                         |
| SendGrid                        | Library for sending emails through SendGrid platform.                 |
| stripe                          | Offical Stripe API library.                                           |
| twilio                          | Twilio API library.                                                   |
| twit                            | Twitter API library.                                                  |
| lodash                          | Handy JavaScript utlities library.                                    |
| uglify-js                       | Dependency for connect-assets library to minify JS.                   |
| validator                       | Used in conjunction with express-validator in **controllers/api.js**. |
| mocha                           | Test framework.                                                       |
| expect.js                       | BDD/TDD assertion library.                                            |
| supertest                       | HTTP assertion library.                                               |
| yui                             | Used by the Yahoo API example.                                        |

Useful Tools and Resources
--------------------------
- [JSDB.io](http://www.jsdb.io) - The Database of JavaScript Libraries
- [JS Recipes](http://sahatyalkabov.com/jsrecipes) - JavaScript tutorials for backend and frontend development.
- [EJS Documentation](http://ejs.co/) - learn about EJS templating
- [JavascriptOO](http://www.javascriptoo.com/) - A directory of JavaScript libraries with examples, CDN links, statistics, and videos.
- [Favicon Generator](http://realfavicongenerator.net/) - Generate favicons for PC, Android, iOS, Windows 8.

Recommended Design Resources
----------------------------
- [Code Guide](http://codeguide.co/) - Standards for developing flexible, durable, and sustainable HTML and CSS.
- [Bootsnipp](http://bootsnipp.com/) - Code snippets for Bootstrap.
- [UIBox](http://www.uibox.in) - Curated HTML, CSS, JS, UI components.
- [Bootstrap Zero](http://bootstrapzero.com/) - Free Bootstrap templates themes.
- [Google Bootstrap](http://todc.github.io/todc-bootstrap/) - Google-styled theme for Bootstrap.
- [Font Awesome Icons](http://fortawesome.github.io/Font-Awesome/icons/) - It's already part of the Express Starter, so use this page as a reference.
- [Colors](http://clrs.cc) - A nicer color palette for the web.
- [Creative Button Styles](http://tympanus.net/Development/CreativeButtons/) - awesome button styles.
- [Creative Link Effects](http://tympanus.net/Development/CreativeLinkEffects/) - Beautiful link effects in CSS.
- [Medium Scroll Effect](http://codepen.io/andreasstorm/pen/pyjEh) - Fade in/out header background image as you scroll.
- [GeoPattern](https://github.com/btmills/geopattern) - SVG background pattern generator.
- [Trianglify](https://github.com/qrohlf/trianglify) - SVG low-poly background pattern generator.


Recommended Node.js Libraries
-----------------------------

- [Nodemon](https://github.com/remy/nodemon) - Automatically restart Node.js server on code changes.
- [geoip-lite](https://github.com/bluesmoon/node-geoip) - Geolocation coordinates from IP address.
- [Filesize.js](http://filesizejs.com/) - Pretty file sizes, e.g. `filesize(265318); // "265.32 kB"`.
- [Numeral.js](http://numeraljs.com) - Library for formatting and manipulating numbers.
- [Node Inspector](https://github.com/node-inspector/node-inspector) - Node.js debugger based on Chrome Developer Tools.
- [node-taglib](https://github.com/nikhilm/node-taglib) - Library for reading the meta-data of several popular audio formats.
- [sharp](https://github.com/lovell/sharp) - Node.js module for resizing JPEG, PNG, WebP and TIFF images.

Recommended Client-side Libraries
---------------------------------

- [Framework7](http://www.idangero.us/framework7) - Full Featured HTML Framework For Building iOS7 Apps.
- [InstantClick](http://instantclick.io) - Makes your pages load instantly by pre-loading them on mouse hover.
- [NProgress.js](https://github.com/rstacruz/nprogress) - Slim progress bars like on YouTube and Medium.
- [Hover](https://github.com/IanLunn/Hover) - Awesome CSS3 animations on mouse hover.
- [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/) - Responsive jQuery Lightbox Plugin.
- [jQuery Raty](http://wbotelhos.com/raty/) - Star Rating Plugin.
- [Headroom.js](http://wicky.nillia.ms/headroom.js/) - Hide your header until you need it.
- [X-editable](http://vitalets.github.io/x-editable/) - Edit form elements inline.
- [Offline.js](http://github.hubspot.com/offline/docs/welcome/) - Detect when user's internet connection goes offline.
- [Alertify.js](http://fabien-d.github.io/alertify.js/) - Sweet looking alerts and browser dialogs.
- [selectize.js](http://brianreavis.github.io/selectize.js/) - Styleable select elements and input tags.
- [drop.js](http://github.hubspot.com/drop/docs/welcome/) -  Powerful Javascript and CSS library for creating dropdowns and other floating displays.
- [scrollReveal.js](https://github.com/julianlloyd/scrollReveal.js) - Declarative on-scroll reveal animations.

Pro Tips
--------

- When installing an NPM package, add a *--save* flag, and it will be automatically
added to `package.json` as well. For example, `npm install --save moment`.
- Use [async.parallel()](https://github.com/caolan/async#parallel) when you need to run multiple
asynchronous tasks, and then render a page, but only when all tasks are completed. For example, you might
want to scrape 3 different websites for some data and render the results in a template
after all 3 websites have been scraped.

FAQ
---

### Why do I get `403 Error: Forbidden` when submitting a form?
You need to add the following hidden input element to your form. This has been
added in the [pull request #40](https://github.com/sahat/hackathon-starter/pull/40)
as part of the CSRF protection.

```HTML
<input type="hidden" name="_csrf" value="<%= _csrf %>"/>
```

**Note:** It is now possible to whitelist certain URLs. In other words you can
specify a list of routes that should bypass CSRF verification check.

**Note 2:** To whitelist dynamic URLs use regular expression tests inside the
CSRF middleware to see if `req.originalUrl` matches your desired pattern.

### What is this Rails 3.1-style asset pipeline that you mentioned under Features?
This is how you typically define static files inside HTML, Jade or any template
for that matter:

```HTML
<link href="/css/styles.css" rel="stylesheet"/>
<script src="/js/lib/jquery-2.1.0.min.js"></script>
<script src="/js/lib/bootstrap.min.js"></script>
<script src="/js/main.js"></script>
```

Simple enough right? But wouldn't it be nice to have it just like that in
development mode, but when you deploy your app to production, have it minified
and concatenated into a single file automatically without any extra effort on
your part?

```HTML
<link href="/css/styles.css" rel="stylesheet"/>
<script src="/js/application.js"></script>
```

As soon as you start bringing in more JavaScript libraries, the benefits of
concatenating and minifying JavaScript files will be even greater. Using
**connect-assets** library, it is  as as simple as declaring these two lines:

```
<%- css('main') %>      // expects public/css/styles.less
<%- js('application') %>  // expects public/js/application.js
```

**Tip:** We can use `css` and `js` functions in Jade templates because in
**connect-assets** middleware options we have added this line: `helperContext: app.locals`.

The only thing you need to remember is to define your JavaScript files inside
`public/js/application.js` using this strange syntax notation (Sprockets-style)
borrowed from Rails. I know it's an extra thing to learn for someone who has
never seen Rails asset pipeline before, but in this case, I think benefits
outweigh the cost.

```js
//= require lib/jquery-2.1.0.min
//= require lib/bootstrap.min
//= require main
```

Using this approach, when working in development mode, **connect-assets** will
load each file individually, without minifying or concatenating anything.
When you deploy your app, it will run in production mode, and so **connect-assets**
will automatically serve a single concatenated & minified `application.js`.
For more information see [Sprockets-style concatenation](https://github.com/adunkman/connect-assets/#sprockets-style-concatenation)
section.

### I get an error when I deploy my app, why?
Chances are you haven't changed the *Database URI* in `secrets.js`. If `db` is
set to `localhost`, it will only work on your machine as long as PostgreSQL is
running. When you deploy to Heroku, OpenShift or some other provider, you will not have PostgreSQL running on `localhost`. If provider use `DATABASE_URL` node variable it should be configured out of the box (Heroku), but either way, please take a look on deploying documentation.

### Why do you have all routes defined in app.js?
For the sake of simplicity. While there might be a better approach,
such as passing `app` context to each controller as outlined in this
[blog](http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/),
I find such style to be confusing for beginners.
It took me a long time to grasp the concept of `exports` and `module.exports`,
let alone having a global `app` reference in other files.
That to me is a backward thinking.
The `app.js` is the "heart of the app", it should be the one referencing
models, routes, controllers, etc.
When working solo on small projects I actually prefer to have everything inside `app.js` as is the case with [this]((https://github.com/sahat/ember-sass-express-starter/blob/master/app.js))
REST API server.

### I don't need a sticky footer, can I delete it?
Absolutely. But unlike a regular footer there is a bit more work involved.
First, delete `#wrap` and `#footer` ID selectors and `html, body { height: 100%; }`
from **styles.less**. Next, delete `#wrap` and `#footer` lines from **layout.ejs**
(By the way, if no element is specified before class or id, Jade assumes it is
a `div` element). Don't forget to indent everything under `#wrap` to the left
once, since this project uses two spaces per block indentation.

### Why is there no Mozilla Persona as a sign-in option?
If you would like to use **Persona** authentication strategy, use the
[pull request #64](https://github.com/sahat/hackathon-starter/pull/64) as a
reference guide. I have explained my reasons why it could not be merged in
[issue #63](https://github.com/sahat/hackathon-starter/issues/63#issuecomment-34898290).

### Can I use Sass instead of LESS stylesheets?
Yes you can! Although you will have to manually convert all existing stylesheets
to Sass, which shouldn't be too hard considering how similar Sass and LESS are.
Simply rename `styles.less` to `styles.scss` and **connect-assets** will
automatically use Sass preprocessor.

Your are not limited to just Sass *or* LESS, you could use both if you want to.
In **layout.ejs** simply specify LESS and Sass stylesheets separately:
```HTML
<%- css('styles') %>  # public/css/styles.less
<%- css('my_sass_styles') %>  # public/css/my_sass_styles.scss
```

And as I already mentioned you do not need to specify the file extension,
**connect-assets** will automatically figure out which CSS preprocessor to use
based on the filetype.

**Note:** I did not include `node-sass` module in *package.json*, so you will
have to install it yourself by running `npm install --save node-sass`.


How It Works (mini guides)
--------------------------

This section is intended for giving you a detailed explanation about
how a particular functionality works. Maybe you are just curious about
how it works, or maybe you are lost and confused while reading the code,
I hope it provides some guidance to you.

### How do flash messages work in this project?
Flash messages allow you to display a message at the end of the request and access
it on next request and only next request. For instance, on a failed login attempt, you would
display an alert with some error message, but as soon as you refresh that page or visit a different
page and come back to the login page, that error message will be gone. It is only displayed once.
This project uses *express-flash* module for flash messages. And that
module is built on top of *connect-flash*, which is what I used in
this project initially. With *express-flash* you don't have to
explicity send a flash message to every view inside `res.render()`.
All flash messages are available in your views via `messages` object by default,
thanks to *express-flash*.

Flash messages have a two-step process. You use `req.flash('errors', { msg: 'Error messages goes here' }`
to create a flash message in your controllers, and then display them in your views:
```HTML
<% if(messages.errors) { %>
  <div class="alert alert-danger fade in">
    <button type="button" data-dismiss="alert" class="close">
      <span class="ion-close-circled"></span>
    </button>
    <% for(msg in messages.errors) { %>
      <div> <%= msg.msg %> </div>
    <% } %>
  </div>
<% } %>
```
In the first step, `'errors'` is the name of a flash message, which should match the
name of the property on `messages` object in your views. You place alert messages
inside `if message.errors` because you don't want to show them flash messages are actually present.
The reason why you pass an error like `{ msg: 'Error messages goes here' }` instead
of just a string - `'Error messages goes here'`, is for the sake of consistency.
To clarify that, *express-validator* module which is used for validating and sanitizing user's input,
returns all errors as an array of objects, where each object has a `msg` property with a message
why an error has occurred. Here is a more general example of what express-validator returns when there are errors present:

```js
[
  { param: "name", msg: "Name is required", value: "<received input>" },
  { param: "email", msg: "A valid email is required", value: "<received input>" }
]
```

To keep consistent with that style, you should pass all flash messages
as `{ msg: 'My flash message' }` instead of a string. Otherwise you will just see an alert box
without an error message. That is because, in **partials/flash.ejs** template it will try to output
`error.msg` (i.e. `"My flash message".msg`), in other words it will try to call a `msg` method on a *String* object,
which will return *undefined*. Everything I just mentioned about errors, also applies
to "info" and "success" flash messages, and you could even create a new one yourself, such as:

**Data Usage Controller (Example)**
```
req.flash('warning', { msg: 'You have exceeded 90% of your data usage' });
```

**User Account Page (Example)**
```HTML
<% if(messages.warning) { %>
  <div class="alert alert-warning fade in">
    <button type="button" data-dismiss="alert" class="close">
      <span class="ion-close-circled"></span>
    </button>
    <% for(msg in messages.warning) { %>
      <div> <%= msg.msg %> </div>
    <% } %>
  </div>
<% } %>
```

`partials/flash.ejs` is a partial template that contains how flash messages
are formatted. Previously, flash
messages were scattered throughout each view that used flash messages
(contact, login, signup, profile), but now, thankfully it is uses a *DRY* approach.

The flash messages partial template is *included* in the `layout.ejs`, along with footer and navigation.
```HTML
body
  #wrap
    include partials/navigation
    .container
      include partials/flash
      block content
  include partials/footer
```

If you have any further questions about flash messages,
please feel free to open an issue and I will update this mini-guide accordingly,
or send a pull request if you  would like to include something that I missed.

<hr>

### How do I create a new page?
A more correct way to be to say "How do I create a new route". The main file `app.js` contains all the routes.
Each route has a callback function associated with it. Sometimes you will see 3 or more arguments
to routes. In cases like that, the first argument is still a URL string, while middle arguments
are what's called middleware. Think of middleware as a door. If this door prevents you from
continuing forward, you won't get to your callback function. One such example is a route that requires authentication.

```js
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
```

It always goes from left to right. A user visits `/account` page. Then `isAuthenticated` middleware
checks if you are authenticated:

```js
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
```

If you are authenticated, you let this visitor pass through your "door" by calling `return next();`. It then proceeds to the
next middleware until it reaches the last argument, which is a callback function that typically renders a template on `GET` requests or redirects on `POST` requests. In this case, if you are authenticated, you will be redirected to *Account Management* page, otherwise you will be redirected to *Login* page.

```js
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};
```

Express.js has `app.get`, `app.post`, `app.put`, `app.delete`, but for the most part you will only use the first two HTTP verbs, unless you are building a RESTful API.
If you just want to display a page, then use `GET`, if you are submitting a form, sending a file then use `POST`.

Here is a typical workflow for adding new routes to your application. Let's say we are building
a page that lists all books from database.

**Step 1.** Start by defining a route.
```js
app.get('/books', bookController.getBooks);
```

---

**Note:** As of Express 4.0 you can define you routes like so:

```js
app.route('/books')
  .get(bookController.getBooks)
  .post(bookController.createBooks)
  .put(bookController.updateBooks)
  .delete(bookController.deleteBooks)
```

And here is how a route would look if it required an *authentication* and an *authorization* middleware:

```js
app.route('/api/twitter')
  .all(passportConf.isAuthenticated)
  .all(passportConf.isAuthorized)
  .get(apiController.getTwitter);
  .post(apiController.postTwitter)
```

Use whichever style that makes sense to you. Either one is acceptable. I really think that chaining HTTP verbs on
`app.route` is very clean and elegant approach, but on the other hand I can no longer see all my routes at a glance
when you have one route per line.

**Step 2.** Create a new schema and a model `Book.js` inside the *models/sequelize* directory.
```js

module.exports = function(db, DataTypes) {
  var Book = db.define('Book', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'books',
    timestamps: false
  });

  return Book;
};
```

**Step 3.** Create a new controller file called `book.js` inside the *controllers* directory.
```js
/**
 * GET /books
 * List all books.
 */
var db = require('../models/sequelize');

exports.getBooks = function(req, res) {
  db.Book.findAll().then(function(docs) {
    res.render('books', { books: docs });
  });
};
```

**Step 4.** Import that controller in `app.js`.
```js
var bookController = require('./controllers/book');
```

**Step 5.** Create `books.ejs` template.
```HTML
<% layout('layout') -%>

<h1>All books</h1>

<ul>
	<% books.forEach(function(book) { %>
    <li> <%= book.name %> </li>
  <% }); %>
</ul>
```

That's it! I will say that you could have combined Step 1, 2, 3 as following:

```js
app.get('/books', function(req, res) {
  db.Book.findAll().then(function(docs) {
    res.render('books', { books: docs });
  });
});
```

Sure, it's simpler, but as soon as you pass 1000 lines of code in `app.js` it becomes a little difficult to navigate the file.
I mean, the whole point of this boilerplate project was to separate concerns, so you could
work with your teammates without running into *MERGE CONFLICTS*. Imagine you have 4 developers
working on a single `app.js`, I promise you it won't be fun resolving merge conflicts all the time.
If you are the only developer then it's fine. But as I said, once it gets up to a certain LoC size, it becomes
difficult to maintain everything in a single file.

That's all there is to it. Express.js is super simple to use.
Most of the time you will be dealing with other APIs to do the real work:
[Sequelize](http://sequelize.readthedocs.org/en/latest/docs/querying/) for querying database, socket.io for sending and receiving messages over websockets,
sending emails, form validation using [express-validator](https://github.com/ctavan/express-validator) library,
parsing websites using [Cheerio](https://github.com/MatthewMueller/cheerio), and etc.

<hr>

### How do I use Socket.io with Express Starter?
[Dan Stroot](https://github.com/dstroot) submitted an excellent [pull request](https://github.com/dstroot/hackathon-starter/commit/0a632def1ce8da446709d92812423d337c977d75) that adds a real-time dashboard with socket.io.
And as  much as I'd like to add it to the project, I think it violates one of the main
principles of the Express Starter:
> When I started this project, my primary focus was on simplicity and ease of use.
> I also tried to make it as generic and reusable as possible to cover most use cases of
> hackathon web apps, **without being too specific**.

When I need to use socket.io, I **really** need it, but most of the time - I don't. But more
importantly, websockets support is still experimental on most hosting providers. As of October 2013,
Heroku supports websockets, but not until you opt-in by running this command:

```js
heroku labs:enable websockets -a myapp
```

And what if you are deploying to OpenShift? They do support websockets, but it is currently in a
preview state. So, for OpenShift you would need to change the socket.io connect URI to the following:

```js
var socket = io.connect('http://yoursite-namespace.rhcloud.com:8000');
```

Wait, why is it on port 8000? Who knows, and if I didn't run across this [blog post](http://velin-georgiev-blog.appspot.com/blog/set-up-nodejs-express-socketio-application-using-websockets-on-openshift-by-red-hat/)
I wouldn't even know I had to use port 8000.

I am really glad that Heroku and OpenShift at least
have a websockets support, because many other PaaS providers still do not support it.
Due to the aforementioned issues with websockets, I cannot include socket.io as part of the Express Starter. *For now...*
If you need to use socket.io in your app, please continue reading.

First you need to install socket.io:
```js
npm install socket.io --save
```

Replace `var app = express();` with the following code:

```js
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
```

I like to have the following code organization in `app.js` (from top to bottom): module dependencies,
import controllers, import configs, connect to database, express configuration, routes,
start the server, socket.io stuff. That way I always know where to look for things.

Add the following code at the end of `app.js`:

```js
io.on('connection', function(socket) {
  socket.emit('greet', { hello: 'Hey there browser!' });
  socket.on('respond', function(data) {
    console.log(data);
  });
  socket.on('disconnect', function() {
    console.log('Socket disconnected');
  });
});
```

One last thing left to change:
```js
app.listen(app.get('port'), function() {
```
to
```js
server.listen(app.get('port'), function() {
```

At this point we are done with the back-end.

You now have a choice - to include your JavaScript code in Jade templates or have all your client-side
JavaScript in a separate file - in `main.js`. I will admit, when I first started out with Node.js and JavaScript in general,
I placed all JavaScript code inside templates because I have access to template variables passed in from Express
right then and there. It's the easiest thing you can do, but also the least efficient and harder to maintain. Since then I
almost never include inline JavaScript inside templates anymore.

But it's also understandable if you want take the easier road.
Most of the time you don't even care about performance during hackathons, you just
want to [*"get shit done"*](http://www.startupvitamins.com/media/products/13/aaron_levie_poster_black.jpg) before the time runs out.
Well, either way, use whichever approach makes more sense to you. At the end of the day,
it's **what** you build that matters, not **how** you build it.

If you want to stick all your JavaScript inside templates, then in `layout.ejs` -
your main template file, add this to `head` block.

```HTML
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hey there, server!' });
  });
</script>
```

**Note:** Notice the path of the `socket.io.js`, you don't actually
have to have `socket.io.js` file anywhere in your project; it will be generated
automatically at runtime.

If you want to have JavaScript code separate from templates, move that inline
script code into `main.js`, inside the `$(document).ready()` function:

```js
$(document).ready(function() {

  // Place JavaScript code here...
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });

});
```

And that's it, we are done!

If you want to see a really cool real-time dashboard check out this
[live example](http://hackathonstarter.herokuapp.com/dashboard). Refer to the
[pull request #23](https://github.com/sahat/hackathon-starter/pull/23/files) to
see how it is implemented.

Sequelize Cheatsheet
-------------------

#### Find all users:
```js
db.User.findAll()
  .then(function(users) {
    console.log(users);
  })
  .catch(function(err) {
    console.error(err);
  });
```

#### Find a user by email:
```js
var userEmail = 'example@gmail.com';
db.User.findOne({ where: { email: userEmail }})
  .then(function(user) {
    console.log(user);
  })
  .catch(function(err) {
    console.error(err);
  });
```

#### Find 5 most recent user accounts:
```js
db.User
  .findAll({
    limit: 5,
    order: [ ['id', 'DESC'] ]
  })
  .then(function(users) {
    console.log(users);
  })
  .catch(function(err) {
    console.error(err);
  });
```

Deployment
----------

Once you are ready to deploy your app, you will need to create an account with
a cloud platform to host it. These are not the only choices, but they are my top
picks. From my experience, **Heroku** is the easiest to get started with, it will
automatically restart your Node.js process when it crashes, zero-downtime
deployments and custom domain support on free accounts. Additionally, you can
create an account with **MongoLab** and then pick one of the *4* providers below.
Again, there are plenty of other choices and you are not limited to just the ones
listed below.

### 1-Step Deployment with Heroku

<img src="http://blog.exadel.com/wp-content/uploads/2013/10/heroku-Logo-1.jpg" width="200">
- Download and install [Heroku Toolbelt](https://toolbelt.heroku.com/)
- In terminal, run `heroku login` and enter your Heroku credentials
- From *your app* directory run `heroku create`
- Run `heroku addons:create heroku-postgresql:hobby-dev` to set up PostgreSQL and configure your environment variables
- Lastly, do `git push heroku master`.  Done!

**Note:** To install Heroku add-ons your account must be verified.


<img src="http://www.opencloudconf.com/images/openshift_logo.png" width="200">
- First, install this Ruby gem: `sudo gem install rhc` :gem:
- Run `rhc login` and enter your OpenShift credentials
- From *your app* directory run `rhc app create MyApp nodejs-0.10`
 - **Note:** *MyApp* is what you want to name your app (no spaces)
- Once that is done, you will be provided with **URL**, **SSH** and **Git Remote** links
- Visit that **URL** and you should see *Welcome to your Node.js application on OpenShift* page
- Copy **Git Remote** and paste it into `git remote add openshift your_git_remote`
- Before you push your app, you need to do a few modifications to your code

Add these two lines to `app.js`, just place them anywhere before `app.listen()`:
```js
var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
```

Then change `app.listen()` to:
```js
app.listen(PORT, IP_ADDRESS, function() {
  console.log("✔ Express server listening on port %d in %s mode", PORT, app.settings.env);
});
```
Add this to `package.json`, after *name* and *version*. This is necessary because, by default, OpenShift looks for `server.js` file. And by specifying `supervisor app.js` it will automatically restart the server when node.js process crashes.

```js
"main": "app.js",
"scripts": {
  "start": "supervisor app.js"
},
```

- Finally, now you can push your code to OpenShift by running `git push -f openshift master`
 - **Note:** The first time you run this command, you have to pass `-f` (force) flag because OpenShift creates a dummy server with the welcome page when you create a new Node.js app. Passing `-f` flag will override everything with your *Express Starter* project repository. Please **do not** do `git pull` as it will create unnecessary merge conflicts.
- And you are done!

<img src="http://upload.wikimedia.org/wikipedia/commons/f/ff/Windows_Azure_logo.png" width="200">

- Login to [Windows Azure Management Portal](http://manage.windowsazure.com/)
- Click the **+ NEW** button on the bottom left of the portal
- Click **WEB SITE**, then **QUICK CREATE**
- Enter a name for **URL** and select the datacenter **REGION** for your web site
- Click on **CREATE WEB SITE** button
- Once the web site status changes to *Running*, click on the name of the web site to access the Dashboard
- At the bottom right of the Quickstart page, select **Set up a deployment from source control**
- Select **Local Git repository** from the list, and then click the arrow
- To enable Git publishing, Azure will ask you to create a user name and password
- Once the Git repository is ready, you will be presented with a **GIT URL**
- Inside your *Express Starter* directory, run `git remote add azure [Azure Git URL]`
- To push your changes simply run `git push azure master`
 - **Note:** *You will be prompted for the password you created earlier*
- On **Deployments** tab of your Windows Azure Web Site, you will see the deployment history

<img src="http://www.comparethecloud.net/wp-content/uploads/2014/06/ibm-bluemix_pr-030514.jpg" width="200">

- Go to [Codename: Bluemix](http://bluemix.net) to signup for the free trial, or login with your *IBM id*
- Install [Cloud Foundry CLI](https://github.com/cloudfoundry/cli)
- Navigate to your **hackathon-starter** directory and then run `cf push [your-app-name] -m 512m` command to deploy the application
 - **Note:** You must specify a unique application name in place of `[your-app-name]`
- Run `cf create-service mongodb 100 [your-service-name]` to create a [MongoDB service](https://www.ng.bluemix.net/docs/#services/MongoDB/index.html#MongoDB)
- Run `cf bind-service [your-app-name] [your-service-name]` to associate your application with a service created above
- Run `cf files [your-app-name] logs/env.log` to see the *environment variables created for MongoDB.
- Copy the **MongoDB URI** that should look something like the following: `mongodb://68638358-a3c6-42a1-bae9-645b607d55e8:46fb97e6-5ce7-4146-9a5d-d623c64ff1fe@192.155.243.23:10123/db`
- Then set it as an environment variable for your application by running `cf set-env [your-app-name] MONGODB [your-mongodb-uri]`
- Run `cf restart [your-app-name]` for the changes to take effect.
- Visit your starter app at **http://[your-app-name].ng.bluemix.net**
- Done!

**Note:** Alternative directions, including how to setup the project with a DevOps pipeline are available at [http://ibm.biz/hackstart](http://ibm.biz/hackstart).
A longer version of these instructions with screenshots is available at [http://ibm.biz/hackstart2](http://ibm.biz/hackstart2).
Also, be sure to check out the [Jump-start your hackathon efforts with DevOps Services and Bluemix](https://www.youtube.com/watch?v=twvyqRnutss) video.

Changelog
---------
TODO

Contributing
------------

If something is unclear, confusing, or needs to be refactored, please let me know.
Pull requests are always welcome, but due to the opinionated nature of this
project, I cannot accept every pull request. Please open an issue before
submitting a pull request. This project uses
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with a
few minor exceptions. If you are submitting a pull request that involves
Jade templates, please make sure you are using *spaces*, not tabs.

License
-------

The MIT License (MIT)

Copyright (c) 2015 Piotr Dąbrowski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

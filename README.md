Buy And Sell App for your Creations
=========
## Introduction

The Buy and Sell App is a full-stack, single-page and retro like web application built with Node, Express, jQuery, HTML, Bootstrap CSS and AJAX. It is an app where artists, creators and others could have their work posted up for sale. Prospective customers are able to contact the sellers and work out deals with them.

- Users are able to view listings, search through listings, message sellers and put items on their favourites list when they want to look back on an item they had their eye on previously.

- Sellers(Admins in our case) are able to add and delete listings of items, mark items as sold and reply to messages of users of the website.

- The application also includes changes to different viewports based on the viewport sizes.

- It is still in development and only functions to the requirements of the midterm project given by Lighthouse Labs.

## Final Product Screenshots

!["Screenshot of URLs page"](https://github.com/victorzzz12/buySellApp/blob/master/docs/full-view.png)
!["Screenshot of URLs page"](https://github.com/victorzzz12/buySellApp/blob/master/docs/medium-view.png)
!["Screenshot of URLs page"](https://github.com/victorzzz12/buySellApp/blob/master/docs/small-view.png)
!["Screenshot of URLs page"](https://github.com/victorzzz12/buySellApp/blob/master/docs/add-listing.png)
!["Screenshot of URLs page"](https://github.com/victorzzz12/buySellApp/blob/master/docs/messages.png)
!["Screenshot of URLs page"](https://github.com/victorzzz12/buySellApp/blob/master/docs/search.png)

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- node-sass
- morgan (Dev dependency)

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm run local` command.

## Warnings & Tips

- Do not edit the `layout.css` file directly, it is auto-generated by `layout.scss`
- Use the `npm run db:reset` command if you like to reset the database and revert to the original data. 
  - It runs through each of the files, in order, and executes them against the database. 
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the data tables and recreate them.


**Thank you for your time!**

More functional changes will be applied in the future!

Hope you have fun playing with our app!

# simple-spa
A simple pre-compiled single page app

## Installation

    npm install
    gulp

## Configuration

Assets to be linted and compiled are described in `config.json`. Each asset can be configured to use a specified compile method:

* JS
  * concat: Takes a `glob` parameter. Concatinates the JavaScript files together (in no particular order)
    - eg. `{ "render": "concat", "glob": "src/js/**/*.js", "dest": "app.js" }`
  * ejs: Takes an `src` parameter. Evaluates the source file using [Embedded JavaScript](http://ejs.co/).
    - eg. `{ "render": "ejs", "src": "src/js/app.js.ejs", "dest": "app.js" }`
* CSS
  * sass: Takes a `src` parameter. Evaluates the source file using SASS
    - eg. `{ "render": "sass", "src": "src/css/app.scss", "dest": "app.css" }`
* HTML
  * ejs: Takes an `src` parameter. Evalues the source file using Embedded JavaScript.
    - eg. `{ "render": "ejs", "src": "src/html/index.html.ejs", "dest": "index.html" }`

All JS and CSS assets are minified using Uglifier.

## Features

* JavaScript & CSS compiling and uglifying
* JSHint
* Karma testing with Jasmine


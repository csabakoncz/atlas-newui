import 'babel-polyfill'
import 'jquery'
import 'select2'
import 'modules/Helpers' //registers Handlebars helpers

import 'main'

class Greeter {
    constructor(private message: string) {
    }
    greet() {
        return "Hello, " + this.message;
    }
}
const element = document.createElement('div');
element.innerHTML = new Greeter('TS World').greet()

document.body.appendChild(element);

// Test ES6 polyfills: String.prototype.includes is missing in Firefox versions < 40
// https://caniuse.com/#feat=es6-string-includes
let check = 'JavaScript'.includes('Java')
console.log(`'JavaScript'.includes('Java')=${check}`)


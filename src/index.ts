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



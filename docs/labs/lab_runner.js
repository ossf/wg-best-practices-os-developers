// lab_runner - run labs
//

const App = class {
    constructor() {}
    get() {
        alert("You are in app.get()");
    }
}

const app = new App();

function run_lab() {
    code = document.getElementById('code').value;
    alert("Hello, code is: " + code);
    // NOTE: We *eval* the string. Evaluating arbitrary strings is
    // usually insecure and dangerous. In this case, we know that the string
    // is provided by the user and run on the same user's browser, so THIS
    // use is okay. At worst, users are attacking themselves.
    eval(code);
}

function init_page() {
    document.getElementById('lab').onsubmit = run_lab;
}

// When the requesting web page loads, initialize things
window.onload = init_page;

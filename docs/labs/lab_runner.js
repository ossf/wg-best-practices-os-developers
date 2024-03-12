// lab_runner - run labs

// This is an early attempt at simulation of Express and express-validator.
// This turned out to be much harder than expected, so we aren't using
// this code, and it may get dropped completely.

// We simulate *just* enough of express and express-validator to run labs
// entirely locally on the client. This way, (1) learners don't need to
// install *anything*, and (2) we don't have big server bills or security
// issues from trying to run arbitrary user-provided code on our servers.

const App = class {
    routes = [];
    constructor() {};
    // See https://expressjs.com/en/guide/routing.html
    get(path, ...callees) {
        // TODO: Record functions. "Callees" will be recorded as an array.
        this.routes.push('get', path, callees);
        alert("You are in app.get() with path " + path + `and routes is now ${this.routes}`);
    }
}

const app = new App();

const Request = class {
    constructor() {}
    send(output) {this.outputcode = output; return this;}
    status(code) {this.httpcode = code; return this;}
};
let req = new Request();

// TODO

// Example https://reflectoring.io/express-middleware/
// const requireJsonContent = (request, response, next) => {
//   if (request.headers['content-type'] !== 'application/json') {
//       response.status(400).send('Server requires application/json')
//   } else {
//     next()
//   }
// }
// function middlewareFunction(request, response, next){
//  ...
//  next()
//}

const regex_int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

const ExpressValidator = class {
    name; // Field to validate
    constructor(name) {this.name = name;};
    isInt() {
        return (req, res) => {
            // TODO: min and max
            return regex_int.test(req.parameters[name]);
	}
    };
}

// Express-validator's "query"
const query = (name) => {
    return new ExpressValidator(name);
};

function isInt() {};
function validationResult(req) {return {}}; // Returns errors
function matchedData(req) {return {}}; // Returns matchedData

// In the real system:
// query('id') = "async (req, _res, next) => {
//         try {
//             await runner.run(req);
//             next();
//         }
//         catch (e) {
//             next(e);
//         }
//     }"
// typeof query('id') is string




function run_lab() {
    code = document.getElementById('code').value;
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

// INLINE TEST
app.get('/invoices', query('id').isInt({min: 1, max: 999999}), (req, res) => {
//   const result = validationResult(req);
//   if (result.isEmpty()) { // No errors
//     const data = matchedData(req);
//     return res.send(`You requested invoice id ${data.id}!`);
//   }
//   res.status(422).send("Invalid input");
})

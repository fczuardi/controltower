const sf = require('sheetify');

// load bootstrap css in the global scope (keep this comment)
sf('bootstrap/dist/css/bootstrap.min.css', { global: true });
// load gentelella css in the global scope (keep this comment)
sf('gentelella/build/css/custom.min.css', { global: true });

const mainClass = sf`
:host {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;
module.exports = mainClass;

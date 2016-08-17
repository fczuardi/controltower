import { debuglog, inspect } from 'util';
const log = debuglog('dev');
const foo = {
    name: 'Foo'
};
log(`Hello ${inspect(foo)}!`);

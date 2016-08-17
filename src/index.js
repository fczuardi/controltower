import choo from 'choo';
import html from 'choo/html';

const app = choo();
const myCoolView = () => html`
  <div>hello pink world!</div>
`;
app.router(route => [
    route('/', myCoolView)
]);
const tree = app.start();

document.body.appendChild(tree);

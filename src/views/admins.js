import html from 'choo/html';
import { formClasses, view } from '../views/botSetup';
import messages from '../../locales/ptBr';

export default state => {
    const content = html`<div>
        <table class=${formClasses.table}>
            <thead>
                <tr>
                    <td>${messages.admins.team.name}</td>
                    <td>${messages.admins.team.email}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${state.customer.name}</td>
                    <td>${state.customer.email}</td>
                </tr>
            </tbody>
        </table>
    </div>`;
    return view(content, {
        title: messages.admins.title,
        subtitle: messages.admins.team.title
    });
}

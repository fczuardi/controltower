import html from 'choo/html';
import { formClasses, panel, view } from '../views/botSetup';
import messages from '../../locales/ptBr';

export default (state, prev, send) => {
    const adminList = html`<div>
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
    const formValues = {
        url: `${window.location.href}?botId=${state.bot.id}`,
        inviteCode: state.bot.inviteCode
    };
    const inviteFields = Object.keys(formValues).map(name => html`
        <div class=${formClasses.formGroup}>
            <label class=${formClasses.label}>
                ${messages.admins.invite[name]}
            </label>
            <div class=${formClasses.inputContainer}>
                <input
                    name=${name}
                    value=${formValues[name] || ''}
                    class=${formClasses.input}
                    readonly
                >
            </div>
        </div>
    `);
    const onSubmit = e => {
        e.preventDefault();
        send('api:updateBot', { botId: state.bot.id, inviteCode: 'new' });
    };
    const inviteAdmin = html`
    <form class=${formClasses.form} onsubmit=${onSubmit}>
        ${messages.admins.invite.instructions.map(instruction => html`
            <p>${instruction}</p>
        `)}
        ${inviteFields}
        <div class=${formClasses.separator}></div>
        <div class=${formClasses.formGroup}>
            <div class=${formClasses.buttonGroup}>
                <button
                    type="submit"
                    class=${formClasses.submitButton}
                    disabled=${state.api.updatingBot}
                >${messages.admins.invite.newKey}</button>
            </div>
        </div>
    </form>
    `;
    const panels = [
        panel(adminList, messages.admins.team.title),
        panel(inviteAdmin, messages.admins.invite.title)
    ];
    return view(messages.admins.title, panels);
};

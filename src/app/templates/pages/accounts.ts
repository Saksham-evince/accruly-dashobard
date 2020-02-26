import { html } from 'lit-html'
import { send } from '../../lib/message'
import { AccountBlock } from '../components/account-block'
import { AccountPublisher } from '../components/account-publisher'
import { AccountEditor } from '../components/account-editor'

export const ActiveAccounts = options => {

  return html`
    <section class="main-section">
      <ul>
        ${options.state.accounts.filter(x => x.status === 'active').map(account => AccountBlock({account, state: options.state}))}
      </ul>
    </section>
  `
}

export const PausedAccounts = options => {

  return html`
    <section class="main-section">
      <ul>
        ${options.state.accounts.filter(x => x.status === 'paused').map(account => AccountBlock({account, state: options.state}))}
      </ul>
    </section>
  `
}

export const CreateAccount = options => {
  return html`
    <section class="main-section create-ad">
      ${AccountPublisher({account: options.state.newAccount, state: options.state})}

      <button style="display:none" id="createaccountbutton" @click=${() => send('createAccount')}>Create Account</button>
    </section>
  `
}

export const AccountSettings = options => {
  return html`
    <section class="main-section create-ad">
      ${AccountEditor({account: options.state.user, state: options.state})}

      <button @click=${() => send('updateAccount', {_id: options.state.user._id})}>Update Account</button>
    </section>
  `
}

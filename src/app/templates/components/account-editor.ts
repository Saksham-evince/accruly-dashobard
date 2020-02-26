import { html } from 'lit-html'
import { send } from '../../lib/message'

export const AccountEditor = options => {
  return html`
    <p>
      <label>
        <span>Email:</span>
        <input type="email" value=${options.account.email} @input=${function(){
          send('updateAccountField', { name: 'email', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>Old password:</span>
        <input type="password" placeholder="password" @input=${function(){
          send('updateAccountField', { name: 'oldpassword', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>New password:</span>
        <input type="password" placeholder="password" @input=${function(){
          send('updateAccountField', { name: 'password', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>Name:</span>
        <input type="text" value=${options.account.name} @input=${function(){
          send('updateAccountField', { name: 'name', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>UTC offset:</span>
        <input type="text" placeholder="+01" value=${options.account.utcOffset} @input=${function(){
          send('updateAccountField', { name: 'utcOffset', value: this.value })
        }}>
      </label>
    </p>

    <p style=${options.state.location === 'settings' ? 'display: none' : 'display: block'}>
      <label>
        <span>Type:</span>
        <select @change=${function () {
          send('updateAccountField', { name: 'type', value: this.options[this.selectedIndex].value })
        }}>
          <option ?selected=${options.account.type === 'admin'}>Admin</option>
          <option ?selected=${options.account.type === 'editor'}>Editor</option>
          <option ?selected=${options.account.type === 'client'}>Client</option>
          <option ?selected=${options.account.type === 'publisher'}>Publisher</option>
        </select>
      </label>
    </p>

    <p style=${options.state.location === 'settings' ? 'display: none' : 'display: block'}>
      <label>
        <span>Status:</span>
        <select @change=${function () {
          send('updateAccountField', { name: 'status', value: this.options[this.selectedIndex].value })
        }}>
          <option value="active" ?selected=${options.account.status === 'active'}>Active</option>
          <option value="paused" ?selected=${options.account.status === 'paused'}>Paused</option>
        </select>
      </label>
    </p>

    <p style=${options.state.updateAccount.type === 'publisher' ? 'display:block' : 'display: none'}>
      <label>
        <span>Exclusive to:</span>
        <select @change=${function () {
          send('updateAccountField', { name: 'exclusiveTo', value: this.options[this.selectedIndex].value })
        }}>
          <option data-userid="" ?selected=${options.account.exclusiveTo === ''}></option>
          ${options.state.accounts.map(account => html`
            <option data-userid=${account.exclusiveTo} ?selected=${options.account.exclusiveTo === account.exclusiveTo}>${account.name}</option>
          `)}
        </select>
      </label>
    </p>

  `
}

import { html } from 'lit-html'
import { send } from '../../lib/message'

export const AccountPublisher = options => {
  return html`
    <p>
      <label>
        <span>Name:</span>
        <input type="text" value=${options.account.name} @input=${function(){
          send('newAccountField', { name: 'name', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>Email:</span>
        <input type="email" value=${options.account.email} @input=${function(){
          send('newAccountField', { name: 'email', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>Password:</span>
        <input type="password" placeholder="password" @input=${function(){
          send('newAccountField', { name: 'password', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>UTC offset:</span>
        <input type="text" placeholder="+01" value=${options.account.utcOffset} @input=${function(){
          send('newAccountField', { name: 'utcOffset', value: this.value })
        }}>
      </label>
    </p>

    <p>
      <label>
        <span>Type:</span>
        <select @change=${function () {
          send('newAccountField', { name: 'type', value: this.options[this.selectedIndex].value })
        }}>
          <option ?selected=${options.account.type === 'admin'}>Admin</option>
          <option ?selected=${options.account.type === 'editor'}>Editor</option>
          <option ?selected=${options.account.type === 'client'}>Client</option>
          <option ?selected=${options.account.type === 'publisher'}>Publisher</option>
        </select>
      </label>
    </p>

    <p>
      <label>
        <span>Status:</span>
        <select @change=${function () {
          send('newAccountField', { name: 'status', value: this.options[this.selectedIndex].value })
        }}>
          <option value="active" ?selected=${options.account.status === 'active'}>Active</option>
          <option value="paused" ?selected=${options.account.status === 'paused'}>Paused</option>
        </select>
      </label>
    </p>

    <p style=${options.state.newAccount.type === 'publisher' ? 'display:block' : 'display:none'}>
      <label>
        <span>Exclusive to:</span>
        <select @change=${function () {
          send('newAccountField ', { name: 'exclusiveTo', value: this.options[this.selectedIndex].value })
        }}>
          <option data-userid="" ?selected=${options.account.exclusiveTo === ''}></option>
          ${options.state.accounts.filter(x => x.type === 'client').map(account => html`
            <option data-userid=${account.exclusiveTo} ?selected=${options.account.exclusiveTo === account.exclusiveTo}>${account.name}</option>
          `)}
        </select>
      </label>
    </p>
  `
}

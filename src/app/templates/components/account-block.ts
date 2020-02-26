import { html } from 'lit-html'
import { send } from '../../lib/message'
import { AccountEditor } from './account-editor'

export const AccountBlock = options => html`
  <li class="account-block">
    <p class="name">${options.account.name}</p>
    <p class="-no-margin">
      <small class="account-metadata"><strong>${options.account.email}</strong></small>
      <button style=${options.account._id === options.state.user._id ? 'display:none' : 'display:inline-block'} class="button-plain -red" @click=${() => send('removeAccount', { _id: options.account._id })}>Remove</button>
      <button class="button-plain" @click=${() => {
        const editorContainer: any = document.querySelector('#id' + options.account._id)
        editorContainer.style.display = 'block'
      }}>Edit</button>
    </p>

    <section class="account-editor-container" id=${'id' + options.account._id}>
      ${AccountEditor({account: options.account, state: options.state})}

      <button @click=${() => send('updateAccount', {_id: options.account._id})}>Update</button>

      ${options.account.status === 'paused'
          ? html `<button @click=${() => send('activateAccount', {_id: options.account._id})}>Activate</button>`
          : html `<button @click=${() => send('deactivateAccount', {_id: options.account._id})}>Deactivate</button>`
      }

    </section>
  </li>
`
